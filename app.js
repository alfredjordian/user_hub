//asynchronous means something is running and waiting while your code is running

// .then is then i will do this callbackhell is when the last callback can't be completed and the program gets stuck
// try to do this thing if it fails (exception) then exit and 
// calling an API is the most common thing you will do 
// promise gives us a package 
// we call fetch, we pass url, it returns a new promise (which is a notifier) 
// async ALWAYS returns a promise so you can await it
// call will never run until await finishes
// go in depth into callback functions

const BASE_URL = 'https://jsonplace-univclone.herokuapp.com';
//****************************FETCHING *********************//

function fetchData(url) {
    return fetch(url).then((resp) => resp.json())

    .catch((err) => console.error(err));

}

function fetchUsers() {
    return fetch(`${ BASE_URL }/users`).then((resp) => resp.json()) 
      // call json on the response, and return the result
    
      
    .catch((err) => console.error(err)
      // use console.error to log out any error
    );
  }



function fetchAlbumList(user) {
    return fetchData(`${ BASE_URL }/users/${ user }/albums?_expand=user&_embed=photos`)
    
       
.catch((err) => console.error(err));

}

// fetchAlbumList(1).then(function (albumList) {

//     console.log(albumList);

// });
// fetchAlbumList(1).then(renderAlbumList);

function fetchPostList(userId) {
    return fetchData(`${ BASE_URL }/users/${ userId }/posts?_expand=user`);
  }
  
function fetchComments(postId) {
    return fetchData(`${ BASE_URL }/posts/${ postId }/comments`);
  }


  fetchComments(1).then(console.log); 

function fetchPhotos(userId){
    return fetchData(`${ BASE_URL }/albums/${ userId }/photos`)
}


// *************************RENDERING************************//
function renderPhoto(albumPhoto) {

    return $(`
    <div class="photo-card">
        <a href=${albumPhoto.url} target="_blank">
            <img src="${albumPhoto.thumbnailUrl}">
            <figure>${albumPhoto.title}</figure>
        </a>
    </div>
`)
}

function renderAlbumList(albumList) {
    $('album-list').empty()


    albumList.forEach((album) => {
        $('album-list')
            .append(`<h3> ${album.title} </h3>`)
    
    })
    $('#app section.active')
        .removeClass("active");
    
    $('#album-list')
        .addClass("active")
            .empty()
    
    albumList.forEach((album) => {
        $('#album-list')
            .append(renderAlbum(album))
    })
}

function renderAlbum (album) {
    (album.photos).forEach((albumPhoto)=>{
        $('photo-card').append(renderPhoto(albumPhoto))
    })
    return $(`
    <div class="album-card">
        <header>
            <h3>${album.title}</h3>
        </header>
        
        <section class="photo-list">
            
        </section>
    </div>
`);

}
function renderUserList(userList) { ////<<----  where is userList getting sent into this function
    $('#user-list').empty();
    userList.forEach((user) => {
        $('#user-list')
            .append(renderUser(user));
        })
};

function renderUser(user) {
return $(`
<div class="user-card">
  <header>
    <h2>${user.id}</h2>
  </header>
  <section class="${user.name}">
    <p><b>Contact:</b> ${user.email}</p>
    <p><b>Works for:</b> ${user.company.name}</p>
    <p><b>Company creed:</b> ${user.company.catchPhrase}</p>
  </section>
  <footer>
    <button class="load-posts">POSTS BY ${user.username}</button>
    <button class="load-albums">ALBUMS BY ${user.username}</button>
  </footer>
</div>
`).data('user' , user)
};


function bootstrap() {
    fetchUsers().then(renderUserList)
}

bootstrap();

function renderPostList(postList) {
    $('post-list').empty();

    postList.forEach((post) => {
        $('post-list')
            .append(`<h3> ${post.title} </h3>`)
    
    })
    $('#app section.active')
        .removeClass("active");
    
    $('#post-list')
        .addClass("active")
            .empty()
    
    postList.forEach((post) => {
        $('#post-list')
            .append(renderPost(post))
    })
    
}

function renderPost (post) {
    return $(`
    <div class="post-card">
        <header>
            <h3>${post.title}</h3>
        </header>
    </div>
`);

}

function setCommentsOnPost(comments) {
    fetchComments(post.comments).then((commentList) => renderCommentList(commentList))
    
    // post.comments might be undefined, or an []
    // if undefined, fetch them then set the result
    // if defined, return a rejected promise
  }


//******************************** INTERACTIVITY ***********************/
$('#user-list').on('click', '.user-card .load-posts', function () {
    // load posts for this user
    let userCard = $(this).closest("div");
    let user= userCard.data("user")    
    
    fetchPostList(user.id).then((postList) => renderPostList(postList))
        console.log(user.id);
        //console.log(user);
    // render posts for this user

  });

$('#user-list').on('click', '.user-card .load-albums', function () {
    // load albums for this user
    let userCard = $(this).closest("div");
    let user= userCard.data("user")
    

    fetchAlbumList(user.id).then((albumList) => renderAlbumList(albumList))
        console.log(user.id); //<---- console says user is not defined
    // render albums for this user
});

