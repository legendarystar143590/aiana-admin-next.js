(async function () {
  var scriptTag = document.currentScript || document.querySelector('script[src*="aiana.js"]');
  var userId = scriptTag.getAttribute('data-user-id');
  var botId = scriptTag.getAttribute('data-bot-id');
  var websiteUrl = window.location.href;
  var src = "https://login.aiana.io/embedding?userIndex=" + encodeURIComponent(userId) + "&botId=" + encodeURIComponent(botId) + "&website=" + encodeURIComponent(websiteUrl);

  var iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.id = "aiana";
  iframe.width = "410";
  iframe.height = "610";  
  iframe.style = "position: fixed; bottom: 10px; right: 10px; z-index:2147483647"; // Example positioning

  // Add event listener to adjust iframe size based on message
  window.addEventListener("message", function(event) {
    if (event.data.type === 'VISIBILITY_CHANGE') {
      if (event.data.isVisible) {
        iframe.style.width = '410px';
        iframe.style.border = "none";
        iframe.style.borderRadius = '16px';
        iframe.style.height = '610px';
      } else {
        iframe.style.width = '50px';
        iframe.style.height = '50px';
        iframe.style.borderRadius = '50%';
        iframe.style.border = "none";
      }
    }
  });

  document.body.appendChild(iframe);
})();
