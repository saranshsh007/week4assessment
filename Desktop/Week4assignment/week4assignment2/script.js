$(document).ready(function () {
  // YouTube API credentials
  const CLIENT_ID = '306260425139-eqgji1lq2oj73j7ombt3pjtad6sa3aen.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyBHGg3fXjN45cJsBuNBxOrNoXlh_7X906s';

  // Load the YouTube API client
  function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest')
      .then(function () {
        console.log('YouTube API client loaded for API key:', API_KEY);
        handleClientLoad();
      })
      .catch(function (error) {
        console.error('Error loading YouTube API client for API key:', API_KEY, error);
      });
  }

  // Handle the client load event
  function handleClientLoad() {
    gapi.auth2.init({
      client_id: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    }).then(function () {
      if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        handleAuthenticated();
      } else {
        renderLoginButton();
      }
    }).catch(function (error) {
      console.error('Error initializing Google API client:', error);
    });
  }

  // Render the login button
  function renderLoginButton() {
    $('#auth-container').html('<button id="login-btn">Login with YouTube</button>');
  }

  // Render the logout button
  function renderLogoutButton() {
    $('#auth-container').html('<button id="logout-btn">Logout</button>');
  }

  // Handle the login event
  function handleLogin() {
    gapi.auth2.getAuthInstance().signIn().then(function () {
      handleAuthenticated();
    });
  }

  // Handle the logout event
  function handleLogout() {
    gapi.auth2.getAuthInstance().signOut().then(function () {
      renderLoginButton();
      hideAuthenticatedFeatures();
    });
  }

  // Handle the authenticated state
  function handleAuthenticated() {
    renderLogoutButton();
    showAuthenticatedFeatures();
    loadPlaylists();
  }

  // Show the authenticated features
  function showAuthenticatedFeatures() {
    $('#playlist-creation-container').show();
    $('#playlist-management-container').show();
    $('#video-search-container').show();
  }

  // Hide the authenticated features
  function hideAuthenticatedFeatures() {
    $('#playlist-creation-container').hide();
    $('#playlist-management-container').hide();
    $('#video-search-container').hide();
  }

  // Load the user's playlists
  function loadPlaylists() {
    gapi.client.youtube.playlists.list({
      mine: true,
      part: 'snippet',
      maxResults: 10
    }).then(function (response) {
      const playlists = response.result.items;
      displayPlaylists(playlists);
    }).catch(function (error) {
      console.error('Error loading playlists:', error);
    });
  }

  // Display the user's playlists
  function displayPlaylists(playlists) {
    const playlistList = $('#playlist-list');
    playlistList.empty();

    playlists.forEach(function (playlist) {
      const listItem = $('<li></li>');
      listItem.text(playlist.snippet.title);
      playlistList.append(listItem);
    });
  }

  // Create a playlist
  $('#playlist-form').on('submit', function (event) {
    event.preventDefault();
    const title = $('input[name="title"]').val();

    gapi.client.youtube.playlists.insert({
      part: 'snippet,status',
      resource: {
        snippet: {
          title: title
        },
        status: {
          privacyStatus: 'private'
        }
      }
    }).then(function (response) {
      alert('Playlist created successfully!');
      loadPlaylists();
    }).catch(function (error) {
      console.error('Error creating playlist:', error);
    });
  });

  // Search for videos
  $('#search-form').on('submit', function (event) {
    event.preventDefault();
    const query = $('input[name="query"]').val();

    gapi.client.youtube.search.list({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: 10
    }).then(function (response) {
      const videos = response.result.items;
      displaySearchResults(videos);
    }).catch(function (error) {
      console.error('Error searching videos:', error);
    });
  });

  // Display search results
  function displaySearchResults(videos) {
    const searchResults = $('#search-results');
    searchResults.empty();

    videos.forEach(function (video) {
      const videoId = video.id.videoId;
      const title = video.snippet.title;
      const thumbnailUrl = video.snippet.thumbnails.default.url;

      const listItem = $('<li></li>');
      const thumbnail = $('<img>').attr('src', thumbnailUrl);
      const videoTitle = $('<p></p>').text(title);
      const addToPlaylistBtn = $('<button></button>').text('Add to Playlist');

      addToPlaylistBtn.on('click', function () {
        const playlistId = 'YOUR_PLAYLIST_ID'; // Replace with desired playlist ID

        gapi.client.youtube.playlistItems.insert({
          part: 'snippet',
          resource: {
            snippet: {
              playlistId: playlistId,
              resourceId: {
                kind: 'youtube#video',
                videoId: videoId
              }
            }
          }
        }).then(function (response) {
          alert('Video added to playlist successfully!');
        }).catch(function (error) {
          console.error('Error adding video to playlist:', error);
        });
      });

      listItem.append(thumbnail, videoTitle, addToPlaylistBtn);
      searchResults.append(listItem);
    });
  }

  // Event listeners for login and logout buttons
  $(document).on('click', '#login-btn', handleLogin);
  $(document).on('click', '#logout-btn', handleLogout);

  // Load Google API client on page load
  $(document).ready(function() {
    gapi.load('client:auth2', loadClient);
  });
});


  