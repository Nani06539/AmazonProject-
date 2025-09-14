import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { firestoreUtils } from '@/lib/firebase-utils';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  // Handle the webhook
  if (eventType === 'user.created') {
    const { id: userId, email_addresses, first_name, last_name, created_at } = evt.data;
    
    try {
      // Create user document in Firebase
      const userData = {
        clerkUserId: userId,
        email: email_addresses?.[0]?.email_address || '',
        firstName: first_name || '',
        lastName: last_name || '',
        createdAt: new Date(created_at),
        updatedAt: new Date(),
        isActive: true
      };

      await firestoreUtils.add('users', userData);
      console.log(`Created Firebase user document for Clerk user: ${userId}`);
    } catch (error) {
      console.error('Error creating Firebase user document:', error);
      return new Response('Error creating user document', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id: userId, email_addresses, first_name, last_name, updated_at } = evt.data;
    
    try {
      // Find and update user document in Firebase
      const users = await firestoreUtils.query('users', [
        { field: 'clerkUserId', operator: '==', value: userId }
      ]);

      if (users.length > 0) {
        const userDoc = users[0];
        const updateData = {
          email: email_addresses?.[0]?.email_address || '',
          firstName: first_name || '',
          lastName: last_name || '',
          updatedAt: new Date(updated_at)
        };

        await firestoreUtils.update('users', userDoc.id, updateData);
        console.log(`Updated Firebase user document for Clerk user: ${userId}`);
      }
    } catch (error) {
      console.error('Error updating Firebase user document:', error);
      return new Response('Error updating user document', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id: userId } = evt.data;
    
    try {
      // Find and mark user as inactive (soft delete)
      const users = await firestoreUtils.query('users', [
        { field: 'clerkUserId', operator: '==', value: userId }
      ]);

      if (users.length > 0) {
        const userDoc = users[0];
        await firestoreUtils.update('users', userDoc.id, {
          isActive: false,
          updatedAt: new Date()
        });
        console.log(`Marked Firebase user as inactive for Clerk user: ${userId}`);
      }
    } catch (error) {
      console.error('Error updating Firebase user document:', error);
      return new Response('Error updating user document', { status: 500 });
    }
  }

  return new Response('', { status: 200 });
}

