'use client';

import { useState } from 'react';

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'book' | 'video' | 'document' | 'link' | 'other';
  url?: string;
  fileUrl?: string;
  fileName?: string;
  author?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ImageGalleryProps {
  images: LibraryItem[];
  onDeleteImage: (id: string) => void;
}

export default function ImageGallery({ images, onDeleteImage }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<LibraryItem | null>(null);
  const [factsPopup, setFactsPopup] = useState<LibraryItem | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'french' | 'arabic'>('english');
  const [factsLoading, setFactsLoading] = useState(false);
  const [generatedFacts, setGeneratedFacts] = useState<string>('');
  const [factsError, setFactsError] = useState<string>('');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadImage = async (image: LibraryItem) => {
    try {
      if (!image.fileUrl) return;
      
      const response = await fetch(image.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.fileName || `ai-generated-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const generateFacts = async () => {
    if (!factsPopup?.fileUrl) return;

    setFactsLoading(true);
    setFactsError('');
    setGeneratedFacts('');

    try {
      const response = await fetch('/api/generate-facts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: factsPopup.fileUrl,
          language: selectedLanguage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate facts');
      }

      setGeneratedFacts(data.facts);
    } catch (error) {
      console.error('Error generating facts:', error);
      setFactsError(error instanceof Error ? error.message : 'Failed to generate facts');
    } finally {
      setFactsLoading(false);
    }
  };

  const openFactsPopup = (image: LibraryItem) => {
    setFactsPopup(image);
    setGeneratedFacts('');
    setFactsError('');
    setSelectedLanguage('english');
  };

  const closeFactsPopup = () => {
    setFactsPopup(null);
    setGeneratedFacts('');
    setFactsError('');
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mr-3">
              <span className="text-2xl">🖼️</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Generated Images</h2>
              <p className="text-gray-600 text-sm">{images.length} image{images.length !== 1 ? 's' : ''} created</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image.fileUrl}
                  alt={image.title}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => setSelectedImage(image)}
                />
              </div>
              
              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="bg-white text-gray-900 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openFactsPopup(image)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600"
                  >
                    Facts
                  </button>
                  <button
                    onClick={() => downloadImage(image)}
                    className="bg-white text-gray-900 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => onDeleteImage(image.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Image info */}
              <div className="mt-2">
                <p className="text-sm text-gray-900 font-medium line-clamp-2">
                  {image.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(image.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Generated Image</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <img
                  src={selectedImage.fileUrl}
                  alt={selectedImage.title}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Title</h4>
                  <p className="text-sm text-gray-900">{selectedImage.title}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                  <p className="text-sm text-gray-900">{selectedImage.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Created</h4>
                  <p className="text-sm text-gray-900">{formatDate(selectedImage.createdAt)}</p>
                </div>
                
                <div className="flex space-x-3 pt-3">
                  <button
                    onClick={() => downloadImage(selectedImage)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => onDeleteImage(selectedImage.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Facts Popup Modal */}
      {factsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="text-2xl mr-2">🧠</span>
                Fun Facts Generator
              </h3>
              <button
                onClick={closeFactsPopup}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* Image Preview */}
              <div className="mb-6">
                <img
                  src={factsPopup.fileUrl}
                  alt={factsPopup.title}
                  className="w-full max-h-48 object-contain rounded-lg bg-gray-50"
                />
              </div>

              {/* Language Selection */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select Language:</h4>
                <div className="flex space-x-3">
                  {[
                    { id: 'english', name: 'English', flag: '🇺🇸' },
                    { id: 'french', name: 'French', flag: '🇫🇷' },
                    { id: 'arabic', name: 'Arabic', flag: '🇸🇦' }
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.id as 'english' | 'french' | 'arabic')}
                      className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedLanguage === lang.id
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="text-lg mr-2">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="mb-6">
                <button
                  onClick={generateFacts}
                  disabled={factsLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
                >
                  {factsLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <span className="text-xl mr-2">✨</span>
                      Generate Fun Facts
                    </>
                  )}
                </button>
              </div>

              {/* Error Display */}
              {factsError && (
                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  <strong>Error:</strong> {factsError}
                </div>
              )}

              {/* Generated Facts */}
              {generatedFacts && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-2xl mr-2">🎯</span>
                    Fun Facts
                  </h4>
                  <div className="prose prose-sm max-w-none">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {generatedFacts}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
