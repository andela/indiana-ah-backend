const head = ` <head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="ie=edge" />
<link href="https://fonts.googleapis.com/css?family=Hind:400,500" rel="stylesheet">
<style>
  * {font-family: 'Hind';}
  .container {width: 80%;margin: 0 auto;background: #0B41CD;color: white;padding: 30px;}
  .username {font-size: 1.2rem;}
  a{color: white;}
  .logo {width: 165px; padding-bottom: 20px; border-bottom: 1px solid #2fb5ee;}
</style>
</head>`;

export const newArticleTemplate = (userName, url) => `<!DOCTYPE html>
<html lang="en">
  ${head}
  <body>
    <div class="container">
      <h3 class="username">Hi There</h3>
      <p class="message">
     ${userName} just published a new article.
      </p>   
        <a href=${url}>Read Article </a>
    </div>
  </body>
</html>`;

export const newFollowerTemplate = userName => `<!DOCTYPE html>
<html lang="en">
${head}
  <body>
    <div class="container">
      <h3 class="username">${userName} is now following you on Authors Haven</h3>
    </div>
  </body>
</html>`;

export const newCommentOnBookMarkedArticlesTemplate = userName => `<!DOCTYPE html>
<html lang="en">
${head}
  <body>
    <div class="container">
      <h3 class="username">${userName} just commented on an article you bookmarked </h3>
    </div>
  </body>
</html>`;
