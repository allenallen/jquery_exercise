$("#btnPost").click(function(event){
	
	event.preventDefault();
	var grandParent = this.parentNode.parentNode;
	var title = $(grandParent).find("input[name='title']").val();
	var date = $(grandParent).find("input[name='date']").val();
	var author = $(grandParent).find("input[name='author']").val();
	var tags = ($(grandParent).find("input[name='tags']").val()).split(',');
	var content = $(grandParent).find("textarea").val();
	document.posts.addPost(title,date,author,tags,content);
	document.tags.addTag(tags);
	post();
});

$("#submit-search").click(function(event){
	event.preventDefault();
	var tag = $('#search-tags-input').val();
	viewPostByTag(tag);
});

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
    alert('substrRegex ' + substrRegex);
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });
    alert('matches ' + matches);
    cb(matches);
  };
};

function isTagFound(tag,tagArray){
	for(var i=0;i<tagArray.length;i++){
		if(tagArray[i] === tag)
			return true;
	}
	return false;
}

function viewPostByTag(tag){
	$("#posts").empty();
	var posts = document.posts.getPosts();
	var filteredPost = [];
	if(tag === ""){
		filteredPost = posts;
	} else {
		for(var i=0;i<posts.length;i++){
			if(isTagFound(tag,posts[i].tags))
				filteredPost.push(posts[i]);
		}
	}
	
	filteredPost.sort(compareDate);
	filteredPost.reverse();

	var container = document.createElement('div');
	container.class = 'col-lg-8 col-md-10 mx-auto';
	for(var i =0;i<filteredPost.length;i++){
		var div = document.createElement('div');
		div.class='post-preview';

		var postLink = document.createElement('a');
		postLink.href = '#postModal';
		$(postLink).click(function(){
			$('#postModal').find('#post-title').innerText = filteredPost[i].title;
		})

		var title = document.createElement('h2');
		title.class='post-title';
		title.innerText = filteredPost[i].title;

		var content = document.createElement('h3');
		content.class='post-subtitle';
		content.innerText = filteredPost[i].content;

		var meta = document.createElement('p');
		meta.class="post-meta";
		meta.innerText = "Posted by " + filteredPost[i].author + " on " +  parseDate(filteredPost[i].date);

		var tags = document.createElement('p');
		tags.class="post-meta";
		var tagsStrings = "";
		for(var j=0;j<filteredPost[i].tags.length;j++){
			tagsStrings += filteredPost[i].tags[j] + " ";
		}
		tags.innerText = "Tags: " + tagsStrings;

		postLink.appendChild(title);
		postLink.appendChild(content);
		
		div.appendChild(postLink);
		div.appendChild(meta);
		div.appendChild(tags);
		container.appendChild(div);
	}
	$('#posts').append(container);
}

function post(){
	$("#posts").empty();
	var posts = document.posts.getPosts();
	posts.sort(compareDate);
	posts.reverse();
	var container = document.createElement('div');
	container.class = 'col-lg-8 col-md-10 mx-auto';
	for(var i =0;i<posts.length;i++){
		var div = document.createElement('div');
		div.class='post-preview';

		var postLink = document.createElement('a');
		postLink.href = '#postModal';
		$(postLink).click(function(){
			$('#postModal').find('#post-title').innerText = posts[i].title;
		})

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
		container.appendChild(div);
	}
	$('#posts').append(container);
}

function compareDate(obj1,obj2){
	var d1 = new Date(obj1.date);
	var d2 = new Date(obj2.date);
	if(d1.getTime() < d2.getTime()){
		return -1;
	} else if (d1.getTime() > d2.getTime()){
		return 1;
	}

	return 0;
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

function Tags(){
	this.tags = [];
}

Posts.prototype.addPost = function(title,date,author,tags,content){
	var postItem = {'title':title,'date':date,'content':content,'author':author,'tags':tags};
	this.post.push(postItem);
}

Posts.prototype.getPosts = function(){
	return this.post;
}

Tags.prototype.addTag = function(tags){
	var tagArray = flattenArray(tags,this.tags);
	this.tags = tagArray;
}

Tags.prototype.getTags = function(){
	return this.tags;
}

document.posts = new Posts();
document.tags = new Tags();

function flattenArray(x,resultingArray){
	var result = resultingArray;
	
	for(var i=0;i<x.length;i++){
		if(x[i] instanceof Array){
			flattenArray(x[i], result);
		}
		else{
			result.push(x[i]);
		}
	}
	return result;
}

// $('input.typeahead').typeahead({
//       source:  function (query, process) {
//         return $.get(document.tags.getTags(), { query: query }, function (data) {
//             console.log(data);
//             data = $.parseJSON(data);
//               return process(data);
//           });
//       }
//       });
$('#search-tags-input').typeahead({
	source:document.tags.getTags(),
	minLength:1
});