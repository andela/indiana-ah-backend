export const newArticleTemplate = userName => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link href="https://fonts.googleapis.com/css?family=Hind:400,500" rel="stylesheet">
    <style>
      * {font-family: 'Alegreya';}
      .container {width: 80%; margin: 0 auto;background:#0B41CD !important; padding: 30px; color: white; border-radius: 3px; box-shadow: 2px 3px 19px -2px rgba(0,0,0,0.49)}
      .username {font-size: 1.2rem;}
      .message{font-size: 1.2rem; text-transform: capitalize}
      .reset-btn {display: inline-block;background: #2fb5ee;padding: 10px; color: #fff !important;text-decoration: none;font-size: 1rem}
      .logo {width: 165px; padding-bottom: 20px; border-bottom: 1px solid #2fb5ee}
    </style>
  </head>
  <body>
    <div class="container">
      <h3 class="username">Hi There</h3>
      <p class="message">
      
       ${userName} just published a new article.

      </p>
      
        Read Article
      </a>
    </div>
  </body>
</html>`;

export const newFollowerTemplate = userName => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link href="https://fonts.googleapis.com/css?family=Hind:400,500" rel="stylesheet">
    <style>
      * {font-family: 'Hind';}
      .container {width: 80%;margin: 0 auto;background: #0B41CD;color: white;padding: 30px;}
      .username {font-size: 1.2rem;}
      .logo {width: 165px; padding-bottom: 20px; border-bottom: 1px solid #2fb5ee;}
    </style>
  </head>
  <body>
    <div class="container">
      <h3 class="username">${userName} is now following you on Authors Haven</h3>
    </div>
  </body>
</html>`;
