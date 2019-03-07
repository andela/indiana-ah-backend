const head = `<head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <meta http-equiv="X-UA-Compatible" content="ie=edge" /> <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet"> <style> main {
  margin: 0 auto;
  width: 50%;
  font-family: 'Nunito', sans-serif;
  height: 900px
}

.container {
  background: #ADD8E6;
  color: white;
}

.Authors-Haven {
  color: black;
  font-size: 50px;
  text-align: left;
  padding: 5px
}

.small {
  text-align: center;
  color: black;
}

.nd_container {
  margin: 0 auto;
  background: white;
  color: black;
  padding: 5px;
}

.username {
  font-size: 1.2rem;
}

a {
  color: white;
}

.logo {
  width: 165px;
  padding-bottom: 20px;
  border-bottom: 1px solid #2fb5ee;
}

.example_c {
  color: #494949 !important;
  background: #ffffff;
  padding: 20px;
  border: 4px solid #494949 !important;
  border-radius: 6px;
  display: inline-block;
  text-decoration: none;
}

.example_c:hover {
  color: black !important;
  background: #ADD8E6;
  cursor: pointer;
  border-color: #ADD8E6 !important;
  transition: all 0.4s ease 0s;
}

</style> </head>`;

export const newArticleTemplate = (userName, url) => `<!DOCTYPE html>
<html lang="en">
${head}

<body>
    <main>
        <div class="container">
            <h1 class="Authors-Haven">Authors Haven</h1>
        </div>
        <div class='nd_container'>
            <h3 class="username">Hi There,</h3>
            <p class="message">
                ${userName} just published a new article.
            </p>
        </div>
        <div class="button_cont">
            <a class="example_c" href=${url} target="_blank" rel="nofollow noopener">Read Article</a>
        </div>
</body>

</html>`;

export const newFollowerTemplate = (userName, url) => `<!DOCTYPE html>
<html lang="en">
${head}
<body>
    <main>
        <div class="container">
            <h1 class="Authors-Haven">Authors Haven</h1>
        </div>
        <div class='nd_container'>
            <h3 class="username">Hi There,</h3>
            <p class="message">
                <p class="username">${userName} is now following you on Authors Haven</p>
            </p>
        </div>
        <div class="button_cont">
            <a class="example_c" href=${url} target="_blank" rel="nofollow noopener">View Profile</a>
        </div>
</body>

</html>`;

export const newCommentOnBookMarkedArticlesTemplate = (userName, url) => `<!DOCTYPE html>
<html lang="en">
${head}
<body>
    <main>
        <div class="container">
            <h1 class="Authors-Haven">Authors Haven</h1>
        </div>
        <div class='nd_container'>
            <h3 class="username">Hi There,</h3>
            <p class="message">
                ${userName} just commented on an article you bookmarked
            </p>
        </div>
        <div class="button_cont">
            <a class="example_c" href=${url} target="_blank" rel="nofollow noopener">View comment</a>
        </div>
</body>
</html>`;
