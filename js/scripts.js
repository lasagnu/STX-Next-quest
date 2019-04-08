const url = 'https://www.googleapis.com/books/v1/volumes?q='
let startIndex = 0
let search_phrase = ''

function httpGetAsync(url, callback)
{
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() { 
        if (request.readyState == 4 && request.status == 200)
            callback(request.responseText)
    }
    request.open("GET", url, true)
    request.send(null)
}

function serializeBooksFromResponse( response ){
	let serialized = new Array()
	let parsed_response = JSON.parse(response)
	for (let item in parsed_response.items){
		let book = new Object()
					
		book['title'] = (typeof parsed_response.items[item].volumeInfo.title === 'undefined') ? 'Not available' : parsed_response.items[item].volumeInfo.title
		book['authors'] = (typeof parsed_response.items[item].volumeInfo.authors === 'undefined') ? false : parsed_response.items[item].volumeInfo.authors
		book['description'] = (typeof parsed_response.items[item].volumeInfo.description === 'undefined') ? 'There is no available description at this time.' : parsed_response.items[item].volumeInfo.description
		book['thumbnail'] = (typeof parsed_response.items[item].volumeInfo.imageLinks === "undefined") ? false : parsed_response.items[item].volumeInfo.imageLinks.thumbnail
		
		serialized.push(book)
	}
	return serialized
}

function createHtmlElementsFromSerializedBooks( books ){
	
	let target_parent_div = document.getElementsByClassName('books_listing')
	
	for( let book in books){
		
		let container = document.createElement('div')
		container.className = 'container'
		
		let title_div = document.createElement('div')
		let title_div_content = document.createTextNode(books[book].title)
		title_div.appendChild(title_div_content)
		title_div.className = 'title'
		
		let authors_div = document.createElement('div')
		let all_authors = ''
		if(books[book].authors){
			for(let author in books[book].authors){
			all_authors += books[book].authors[author]
			all_authors = (author < books[book].authors.length - 1) ? all_authors + ', ' : all_authors
			} 
		} else {
			all_authors = 'not available'
		}
		let authors_div_content = document.createTextNode(all_authors)
		authors_div.appendChild(authors_div_content)
		authors_div.className = 'authors'
		
		let description_div = document.createElement('div')
		let description_div_content = document.createTextNode(books[book].description)
		description_div.appendChild(description_div_content)
		description_div.className = 'description'
		
		let img_div = document.createElement('img')
		img_div.src = (books[book].thumbnail === false) ? 'img/noimg.png' : books[book].thumbnail
		img_div.className = 'image'
		
		container.appendChild(title_div)
		container.appendChild(authors_div)
		container.appendChild(description_div)
		container.appendChild(img_div)
		
		target_parent_div[0].appendChild(container)
	}
}

function findBooksByName( search_phrase, startIndex ){
	let complete_url = url + search_phrase + '&startIndex=' + startIndex
	
	httpGetAsync(complete_url, function(cb) {
				
				let parsed_response = JSON.parse(cb)
				serialized = serializeBooksFromResponse(cb)
				createHtmlElementsFromSerializedBooks(serialized)
				
	})
	
}

function deleteCurrentSearch(){
	
	let parent_node = document.querySelector('.books_listing')
	
	if(parent_node !== null){
		parent_node.innerHTML = ""
	}
	
}

if( window.addEventListener ){
	window.addEventListener('scroll',scroll)
}else if( window.attachEvent ){
	window.attachEvent('onscroll',scroll);
}

function scroll(ev){
	
    let st = Math.max(document.documentElement.scrollTop,document.body.scrollTop);
	// when screen reaches bottom
	if((st+document.documentElement.clientHeight)>=document.documentElement.scrollHeight ){
		startIndex += 10
		findBooksByName(search_phrase, startIndex)
    }
}

document.addEventListener('DOMContentLoaded', function() {
  
	[].forEach.call(document.querySelectorAll('.search_bar'), function(el) {
		el.addEventListener('change', function() {
			
			startIndex = 0
			search_phrase = document.querySelectorAll('.search_bar')[0].value
			
			deleteCurrentSearch()
			
			findBooksByName(search_phrase, startIndex)
		
		})
	})
  
})
