$(function() {
	var offset = 0;
	var limit = 7;
	var ajaxDone = true;
	var morePages = true;
	var editId = 0;
	var commentPostId = 0;
	var uploads = [];
	Dropzone.autoDiscover = false;

	initUpload();

	$(window).scroll(scrolled);
	$("#add-post").click(showAddPost);
	$("#cancel-post-button").click(removeAddPost);
	$("#save-post-button").click(savePosts);
	$("#delete-post-button").click(deletePost);
	$("#cancel-comment").click(closeAddComment);
	$("#save-comment").click(saveComment);
	/*$("#search").keypress(searchKey);*/
	$("#search").bind("search", searchKey);
	$("main").on("click", ".comment-icon", showAddComment);
	$("main").on("click", ".editable", showEditPost);
	$("main").on("click", ".comment-count", getComments);
	$("main").on("click", ".comment-count-shown", removecomments);
	$("#datepicker").datepicker();
	$("main").on("click", ".editable2", showEditComment);
	$("main").on("click", "#delete-comment", deleteComment);

	getPosts();

	function initUpload() {
		var dzDiv = $("#upload");
		dzDiv.addClass("dropzone");
		var dz = new Dropzone("#upload", {
			paramName: "files",
			url: "/upload"
		});
		dz.on("success", uploadComplete);
		dz.on("error", function(file, msg) {
			alert(msg);
		});
	}

	function uploadComplete(event, response) {
		console.log(response);
		uploads.push(response);
	}


	function scrolled() {
		if (ajaxDone && morePages) {
			var top = $(this).scrollTop();
			var size = $("body").height();
			var height = $(this).height();
			if (top >= size - height) {
				offset += limit;
				getPosts();
			}
		}

	}

	function searchKey() {
		ajaxDone = false;
		offset = 0;
		$.ajax({
			url: "/search-posts",
			method: "GET",
			dataType: "json",
			data: {
				text: $("#search").val(),
				limit: limit,
				offset: offset,
			},
			error: function() {
				ajaxDone = true;
				ajaxError();
			},
			success: function(data) {
				ajaxDone = true;
				if (data.length < limit) {
					morePages = false;
				}
				morePages = true;
				offset = 0;
				$(".post").remove();
				buildPosts(data);
				console.log(ajaxDone + " ajaxdone " + "limit = " + limit + " data.length = " + data.length);
				if (data.length < limit) {
					morePages = false;
				}
			}
		});
	}

	function closeAddComment() {
		$(this).parent().hide();
	}

	function removecomments() {
		var comments = $(this).parent().parent().find(".post-comment");
		comments.remove();
		$(this).removeAttr("class");
		$(this).addClass("comment-count");
	}

	function showAddPost() {
		resetPost();
		$("#create-post-popup").addClass("show-add-popup");
		$("main").addClass("main-add-popup");
		$("#delete-post-button").hide();
	}

	function removeAddPost() {
		resetPost();
		$("#create-post-popup").removeClass("show-add-popup");
		$("main").removeClass("main-add-popup");
	}


	function resetPost() {
		editId = 0;
		$("#create-post-popup textarea").val("");
		$("#datepicker").val("");
		$("#upload").removeClass();
		$("#upload").addClass("dropzone dz-clickable");
		$(".dz-preview").remove();

	}

	function showEditPost() {
		console.log($(this).data("id"));
		$("#delete-post-button").show();
		var text = $(this).parent().parent().find(".post-content").text();
		var date = $(this).parent().parent().find(".datelocation").text();
		console.log(text);
		console.log(date);
		$("#create-post-popup textarea").val(text);
		$("#datepicker").val(date);
		$("#create-post-popup").addClass("show-add-popup");
		$("main").addClass("main-add-popup");
		var id = $(this).data("id");
		editId = id;
	}

	function showAddComment() {
		editId = 0;
		commentPostId = $(this).parent().parent().find(".editable").data("id");
		console.log(commentPostId);
		$("#add-comment-popup textarea").val("");
		var $popup = $("#add-comment-popup").detach();
		$(this).parent().parent().after($popup);
		$popup.show();
	}

	function showEditComment() {
		id = $(this).parent().find(".editable2").data("id");
		var text = $(this).parent().parent().find(".comment-content").text();
		var postId = $(this).parent().parent().parent().find(".editable").data("id");
		console.log(text);
		console.log(postId);
		editId = id;
		console.log(editId);
		$("#add-comment-popup textarea").val(text);
		var $editpopup = $("#add-comment-popup").detach();
		$(this).parent().parent().after($editpopup);
		$editpopup.show();
	}


	function getComments() {
		var postId = $(this).parent().parent().find(".editable").data("id");
		var commentLocation = $(this).parent().parent();
		$(this).removeAttr("class");
		$(this).addClass("comment-count-shown");
		console.log(postId);
		$.ajax({
			url: "/get-comments",
			method: "get",
			type: "json",
			data: {
				postId: postId
			},
			error: ajaxError,
			success: function(data) {
				console.log(data);
				for (var i = 0; i < data.length; i++) {
					var $comment = $("#comment-template").clone();
					$comment.removeAttr("id");
					$comment.addClass("post-comment");
					$comment.find(".comment-username").append(data[i].user.name);
					$comment.find(".comment-content").append(data[i].content);

					if (!data[i].editable) {
						$comment.find(".editable2").hide();
					}

					$comment.find(".editable2").data("id", data[i].id);
					$(commentLocation).append($comment);
				}


			}
		});
	}

	function saveComment() {
		var content = $("#add-comment-popup textarea").val();
		console.log("editId " + editId);
		console.log("commentPostId " + commentPostId);
		console.log(content);
		$.ajax({
			url: "/save-comment",
			method: "POST",
			type: "json",
			data: {
				content: content,
				id: editId,
				postId: commentPostId
			},
			error: ajaxError,
			success: function() {
				location.reload();
			}
		});
	}


	function deletePost() {
		$.ajax({
			url: "/delete-post",
			method: "get",
			type: "json",
			data: {
				id: editId
			},
			error: ajaxError,
			success: function(data) {
				resetPost();
				removeAddPost();
				reloadPosts();
				ajaxDone = true;
				if (data.length < limit) {
					morePages = false;
				}
				morePages = true;
				offset = 0;
				$(".post").remove();
				buildPosts(data);
				console.log(ajaxDone + " ajaxdone " + "limit = " + limit + " data.length = " + data.length);
				if (data.length < limit) {
					morePages = false;
				}
				//getPosts();
			}
		});
	}

	function deleteComment() {
		$.ajax({
			url: "/delete-comment",
			method: "get",
			type: "json",
			data: {
				id: editId
			},
			error: ajaxError,
			success: function() {
				location.reload();
			}
		});
	}

	function reloadPosts() {
		offset = 0;
		$(".post").remove();
		getPosts();
	}

	function savePosts() {
		var $div = $("<div/>");
		var $images = $("<p/>");
		for (var i = 0; i < uploads.length; i++) {
			var $a = $("<a/>")
			$a.attr("href", uploads[i].file);
			$img = $("<img/>");
			$img.attr("src", uploads[i].thumbnail);
			$a.append($img);
			$images.append($a);
		}
		$div.append($images);
		uploads = [];
		ajaxDone = false;
		console.log($("#datepicker").val());
		$.ajax({
			url: "/save-post",
			method: "post",
			type: "json",
			data: {
				content: $("#create-post-popup textarea").val() + $div.html(),
				id: editId,
				date: $("#datepicker").val(),
			},
			error: ajaxError,
			success: function(data) {
				console.log(data);
				removeAddPost();
				reloadPosts();
				// getPosts();
				ajaxDone = true;
				if (data.length < limit) {
					morePages = false;
				}
				morePages = true;
				offset = 0;
				$(".post").remove();
				if (data.length < limit) {
					morePages = false;
				}
			}
		});
	}


	function getPosts() {
		ajaxDone = false;
		var text = $("#search").val();
		var url = "/get-posts";
		var data = {
			limit: limit,
			offset: offset,
		}
		if (text != "") {
			url = "/search-posts";
			data.text = text;
		}
		console.log(offset);
		$.ajax({
			url: url,
			method: "get",
			type: "json",
			data: data,
			error: function() {
				ajaxDone = true;
				ajaxError();
			},
			success: function(data) {
				//console.log(data);
				ajaxDone = true;
				if (data.length < limit) {
					morePages = false;
				}
				buildPosts(data);
			}
		});
	}


	function buildPosts(data) {
		console.log(data);
		for (var i = 0; i < data.length; i++) {
			var $post = $("#post-template").clone();
			$post.removeAttr("id");
			$post.addClass("post");
			$post.find(".username").append(data[i].user.name);
			var date = data[i].date;
			var dateFixed = date.substring(0, 10);
			$post.find(".datelocation").append(dateFixed);
			$post.find(".post-content").append(data[i].content);

			if (!data[i].editable) {
				$post.find(".editable").hide();
			}

			$post.find(".editable").data("id", data[i].id);
			$post.find(".comment-count").append(data[i].commentCount + " comment(s)");
			$("main").append($post);

		}


	}

	function ajaxError() {
		alert("ajax error");
	}


});