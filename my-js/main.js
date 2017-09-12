$("button").click(function(){
	if(this.innerText === 'POST'){
		var grandParent = this.parentNode.parentNode;
		var title = $(grandParent).find("input[name='title']").val();
		var date = $(grandParent).find("input[name='date']").val();
		var author = $(grandParent).find("input[name='author']").val();
		var tags = ($(grandParent).find("input[name='tags']").val()).split(',');
		var content = $(grandParent).find("textarea").val();
		document.posts.addPost(title,date,author,tags,content);
		post();
	}
});

function post(){
	var posts = document.posts.getPosts();
	for(var i =0;i<posts.length;i++){
		var div = document.createElement('div');
		div.class='post-preview';

		var postLink = document.createElement('a');
		postLink.href = 'post.html';

		var title = document.createElement('h2');
		title.class='post-title';
		title.innerText = posts[i].title;

		var content = document.createElement('h3');
		content.class='post-subtitle';
		content.innerText = posts[i].content;

		var meta = document.createElement('p');
		meta.class="post-meta";
		meta.innerText = "Posted by " + posts[i].author + " on " +  parseDate(posts[i].date);

		var tags = document.createElement('p');
		tags.class="post-meta";
		var tagsStrings = "";
		for(var j=0;j<posts[i].tags.length;j++){
			tagsStrings += posts[i].tags[j] + " ";
		}
		tags.innerText = "Tags: " + tagsStrings;

		postLink.appendChild(title);
		postLink.appendChild(content);
		
		div.appendChild(postLink);
		div.appendChild(meta);
		div.appendChild(tags);
		// var post = '<div class="post-preview"><a href="post.html"><h2 class="post-title">'
		// 			+ posts[i].title +'</h2>'
		// 			+'<h3 class="post-subtitle">'+ posts[i].content+'</h3></a>'
		// 			+'<p class="post-meta">Posted by <a href="#">'+posts[i].author +'</a> on '+ parseDate(posts[i].date)+'</p>'
		// 			+'<p class="post-meta">Tags: '+ '</p></div> ';
		$("#posts").append(div);
	}
}

function parseDate(dateValue){
	var monthNames = ["January", "February", "March", "April", "May", "June",
						  "July", "August", "September", "October", "November", "December"
						];

	var date = new Date(dateValue);
	var dateString = "";
	dateString += monthNames[date.getMonth()];
	dateString += " " + date.getDate();
	dateString += ", " + date.getFullYear();
	return dateString;
}

function Posts(){
	this.post = [];
}

Posts.prototype.addPost = function(title,date,author,tags,content){
	var postItem = {'title':title,'date':date,'content':content,'author':author,'tags':tags};
	this.post.push(postItem);
}

Posts.prototype.getPosts = function(){
	return this.post;
}

document.posts = new Posts();