// Example fetch request to the test route
async function testRoute() {
    const response = await fetch('/api/test/67996daf16a6f8f5f839bf00');
    const data = await response.json();
  
    console.log(data); // Should log { id: '67996daf16a6f8f5f839bf00' }
  }
  
  testRoute();
  