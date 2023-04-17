$(document).ready(function() {var formatter = new CucumberHTML.DOMFormatter($('.cucumber-report'));formatter.uri("src/test/resources/amazon.features/AmazonSearch.feature");
formatter.feature({
  "name": "Searching items on Amazon",
  "description": "",
  "keyword": "Feature",
  "tags": [
    {
      "name": "@amazon"
    }
  ]
});
formatter.background({
  "name": "User is  already on Amazon home page",
  "description": "",
  "keyword": "Background"
});
formatter.step({
  "name": "User is on amazon home page",
  "keyword": "Given "
});
formatter.match({
  "location": "AmazonSteps.user_is_on_amazon_home_page()"
});
formatter.result({
  "status": "passed"
});
formatter.scenario({
  "name": "TC1- Searching LG 24UD58-B 24-Inch 4k Monitor",
  "description": "",
  "keyword": "Scenario",
  "tags": [
    {
      "name": "@amazon"
    }
  ]
});
formatter.step({
  "name": "User search for LG 24UD58-B 24-Inch 4k Monitor",
  "keyword": "When "
});
formatter.match({
  "location": "AmazonSteps.user_search_for_LG_UD_B_Inch_k_Monitor(Integer,Integer,Integer,Integer)"
});
formatter.result({
  "status": "passed"
});
formatter.step({
  "name": "User chooses LG 24UD58-B 24-Inch 4k Monitor",
  "keyword": "And "
});
formatter.match({
  "location": "AmazonSteps.user_chooses_LG_UD_B_Inch_k_Monitor(Integer,Integer,Integer,Integer)"
});
formatter.result({
  "status": "passed"
});
formatter.step({
  "name": "User Should be able to add it to cart",
  "keyword": "Then "
});
formatter.match({
  "location": "AmazonSteps.user_Should_be_able_to_add_it_to_cart()"
});
formatter.result({
  "status": "passed"
});
formatter.background({
  "name": "User is  already on Amazon home page",
  "description": "",
  "keyword": "Background"
});
formatter.step({
  "name": "User is on amazon home page",
  "keyword": "Given "
});
formatter.match({
  "location": "AmazonSteps.user_is_on_amazon_home_page()"
});
formatter.result({
  "status": "passed"
});
formatter.scenario({
  "name": "TC2- Searching Metasploit: The Penetration Tester\u0027s Guide Book",
  "description": "",
  "keyword": "Scenario",
  "tags": [
    {
      "name": "@amazon"
    }
  ]
});
formatter.step({
  "name": "User search for The Metasploit: The Penetration Tester\u0027s Guide Book",
  "keyword": "When "
});
formatter.match({
  "location": "AmazonSteps.user_search_for_The_Metasploit_The_Penetration_Tester_s_Guide_Book()"
});
formatter.result({
  "status": "passed"
});
formatter.step({
  "name": "User clicks on Metasploit: The Penetration Tester\u0027s Guide Book",
  "keyword": "And "
});
formatter.match({
  "location": "AmazonSteps.user_clicks_on_Metasploit_The_Penetration_Tester_s_Guide_Book()"
});
formatter.result({
  "status": "passed"
});
formatter.step({
  "name": "User Should be able to add it to cart",
  "keyword": "Then "
});
formatter.match({
  "location": "AmazonSteps.user_Should_be_able_to_add_it_to_cart()"
});
formatter.result({
  "status": "passed"
});
formatter.background({
  "name": "User is  already on Amazon home page",
  "description": "",
  "keyword": "Background"
});
formatter.step({
  "name": "User is on amazon home page",
  "keyword": "Given "
});
formatter.match({
  "location": "AmazonSteps.user_is_on_amazon_home_page()"
});
formatter.result({
  "status": "passed"
});
formatter.scenario({
  "name": "TC3- Searching a cup with a cat on it",
  "description": "",
  "keyword": "Scenario",
  "tags": [
    {
      "name": "@amazon"
    }
  ]
});
formatter.step({
  "name": "User search for a cup with a cat on it",
  "keyword": "When "
});
formatter.match({
  "location": "AmazonSteps.user_search_for_a_cup_with_a_cat_on_it()"
});
formatter.result({
  "error_message": "org.openqa.selenium.NoSuchWindowException: no such window: window was already closed\n  (Session info: chrome\u003d105.0.5195.102)\nBuild info: version: \u00273.141.59\u0027, revision: \u0027e82be7d358\u0027, time: \u00272018-11-14T08:17:03\u0027\nSystem info: host: \u0027MacBook-Pro-23.local\u0027, ip: \u0027192.168.0.4\u0027, os.name: \u0027Mac OS X\u0027, os.arch: \u0027x86_64\u0027, os.version: \u002710.13.6\u0027, java.version: \u002712.0.2\u0027\nDriver info: org.openqa.selenium.chrome.ChromeDriver\nCapabilities {acceptInsecureCerts: false, browserName: chrome, browserVersion: 105.0.5195.102, chrome: {chromedriverVersion: 105.0.5195.52 (412c95e51883..., userDataDir: /var/folders/hk/j7mj1c2n0rz...}, goog:chromeOptions: {debuggerAddress: localhost:54981}, javascriptEnabled: true, networkConnectionEnabled: false, pageLoadStrategy: normal, platform: MAC, platformName: MAC, proxy: Proxy(), setWindowRect: true, strictFileInteractability: false, timeouts: {implicit: 0, pageLoad: 300000, script: 30000}, unhandledPromptBehavior: dismiss and notify, webauthn:extension:credBlob: true, webauthn:extension:largeBlob: true, webauthn:virtualAuthenticators: true}\nSession ID: c7af490c88c55e763c8d3a3c88886762\n*** Element info: {Using\u003dxpath, value\u003d//input[@type\u003d \u0027text\u0027][1]}\n\tat java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)\n\tat java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)\n\tat java.base/java.lang.reflect.Constructor.newInstanceWithCaller(Constructor.java:500)\n\tat java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:481)\n\tat org.openqa.selenium.remote.http.W3CHttpResponseCodec.createException(W3CHttpResponseCodec.java:187)\n\tat org.openqa.selenium.remote.http.W3CHttpResponseCodec.decode(W3CHttpResponseCodec.java:122)\n\tat org.openqa.selenium.remote.http.W3CHttpResponseCodec.decode(W3CHttpResponseCodec.java:49)\n\tat org.openqa.selenium.remote.HttpCommandExecutor.execute(HttpCommandExecutor.java:158)\n\tat org.openqa.selenium.remote.service.DriverCommandExecutor.execute(DriverCommandExecutor.java:83)\n\tat org.openqa.selenium.remote.RemoteWebDriver.execute(RemoteWebDriver.java:552)\n\tat org.openqa.selenium.remote.RemoteWebDriver.findElement(RemoteWebDriver.java:323)\n\tat org.openqa.selenium.remote.RemoteWebDriver.findElementByXPath(RemoteWebDriver.java:428)\n\tat org.openqa.selenium.By$ByXPath.findElement(By.java:353)\n\tat org.openqa.selenium.remote.RemoteWebDriver.findElement(RemoteWebDriver.java:315)\n\tat org.openqa.selenium.support.pagefactory.DefaultElementLocator.findElement(DefaultElementLocator.java:69)\n\tat org.openqa.selenium.support.pagefactory.internal.LocatingElementHandler.invoke(LocatingElementHandler.java:38)\n\tat com.sun.proxy.$Proxy16.sendKeys(Unknown Source)\n\tat amazon_step_definitions.AmazonSteps.user_search_for_a_cup_with_a_cat_on_it(AmazonSteps.java:67)\n\tat ✽.User search for a cup with a cat on it(src/test/resources/amazon.features/AmazonSearch.feature:23)\n",
  "status": "failed"
});
formatter.step({
  "name": "User clicks on the favirote cup",
  "keyword": "And "
});
formatter.match({
  "location": "AmazonSteps.user_clicks_on_the_favirote_cup()"
});
formatter.result({
  "status": "skipped"
});
formatter.step({
  "name": "User should be able to take the screenshot of the page",
  "keyword": "And "
});
formatter.match({
  "location": "AmazonSteps.user_should_be_able_to_take_the_screenshot_of_the_page()"
});
formatter.result({
  "status": "skipped"
});
formatter.step({
  "name": "User Should be able to add it to cart",
  "keyword": "Then "
});
formatter.match({
  "location": "AmazonSteps.user_Should_be_able_to_add_it_to_cart()"
});
formatter.result({
  "status": "skipped"
});
formatter.background({
  "name": "User is  already on Amazon home page",
  "description": "",
  "keyword": "Background"
});
formatter.step({
  "name": "User is on amazon home page",
  "keyword": "Given "
});
formatter.match({
  "location": "AmazonSteps.user_is_on_amazon_home_page()"
});
formatter.result({
  "error_message": "org.openqa.selenium.NoSuchWindowException: no such window: window was already closed\n  (Session info: chrome\u003d105.0.5195.102)\nBuild info: version: \u00273.141.59\u0027, revision: \u0027e82be7d358\u0027, time: \u00272018-11-14T08:17:03\u0027\nSystem info: host: \u0027MacBook-Pro-23.local\u0027, ip: \u0027192.168.0.4\u0027, os.name: \u0027Mac OS X\u0027, os.arch: \u0027x86_64\u0027, os.version: \u002710.13.6\u0027, java.version: \u002712.0.2\u0027\nDriver info: org.openqa.selenium.chrome.ChromeDriver\nCapabilities {acceptInsecureCerts: false, browserName: chrome, browserVersion: 105.0.5195.102, chrome: {chromedriverVersion: 105.0.5195.52 (412c95e51883..., userDataDir: /var/folders/hk/j7mj1c2n0rz...}, goog:chromeOptions: {debuggerAddress: localhost:54981}, javascriptEnabled: true, networkConnectionEnabled: false, pageLoadStrategy: normal, platform: MAC, platformName: MAC, proxy: Proxy(), setWindowRect: true, strictFileInteractability: false, timeouts: {implicit: 0, pageLoad: 300000, script: 30000}, unhandledPromptBehavior: dismiss and notify, webauthn:extension:credBlob: true, webauthn:extension:largeBlob: true, webauthn:virtualAuthenticators: true}\nSession ID: c7af490c88c55e763c8d3a3c88886762\n\tat java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)\n\tat java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)\n\tat java.base/java.lang.reflect.Constructor.newInstanceWithCaller(Constructor.java:500)\n\tat java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:481)\n\tat org.openqa.selenium.remote.http.W3CHttpResponseCodec.createException(W3CHttpResponseCodec.java:187)\n\tat org.openqa.selenium.remote.http.W3CHttpResponseCodec.decode(W3CHttpResponseCodec.java:122)\n\tat org.openqa.selenium.remote.http.W3CHttpResponseCodec.decode(W3CHttpResponseCodec.java:49)\n\tat org.openqa.selenium.remote.HttpCommandExecutor.execute(HttpCommandExecutor.java:158)\n\tat org.openqa.selenium.remote.service.DriverCommandExecutor.execute(DriverCommandExecutor.java:83)\n\tat org.openqa.selenium.remote.RemoteWebDriver.execute(RemoteWebDriver.java:552)\n\tat org.openqa.selenium.remote.RemoteWebDriver.get(RemoteWebDriver.java:277)\n\tat amazon_step_definitions.AmazonSteps.user_is_on_amazon_home_page(AmazonSteps.java:28)\n\tat ✽.User is on amazon home page(src/test/resources/amazon.features/AmazonSearch.feature:5)\n",
  "status": "failed"
});
formatter.scenario({
  "name": "TC3- Removing the Metasploit: The Penetration Tester\u0027s Guide Book from the cart and confirm it is removed from the cart",
  "description": "",
  "keyword": "Scenario",
  "tags": [
    {
      "name": "@amazon"
    }
  ]
});
formatter.step({
  "name": "User removes the LG 24UD58-B 24-Inch 4k Monitor from the cart",
  "keyword": "When "
});
formatter.match({
  "location": "AmazonSteps.user_removes_the_LG_UD_B_Inch_k_Monitor_from_the_cart(Integer,Integer,Integer,Integer)"
});
formatter.result({
  "status": "skipped"
});
formatter.step({
  "name": "User should not see the LG 24UD58-B 24-Inch 4k Monitor in the cart",
  "keyword": "Then "
});
formatter.match({
  "location": "AmazonSteps.user_should_not_see_the_LG_UD_B_Inch_k_Monitor_in_the_cart(Integer,Integer,Integer,Integer)"
});
formatter.result({
  "status": "skipped"
});
});