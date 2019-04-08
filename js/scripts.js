let url = 'https://www.googleapis.com/books/v1/volumes?q='
let start_index = 0
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

function serializeBooksFromResponse(response){
	let serialized_books = new Array()
	let parsed_response = JSON.parse(response)
	for (let item in parsed_response.items){
		let book = new Object()
					
		book['title'] = (typeof parsed_response.items[item].volumeInfo.title === 'undefined') ? 'N/A' : parsed_response.items[item].volumeInfo.title
		book['authors'] = (typeof parsed_response.items[item].volumeInfo.authors === 'undefined') ? 'N/A' : parsed_response.items[item].volumeInfo.authors
		book['description'] = (typeof parsed_response.items[item].volumeInfo.description === 'undefined') ? 'No description is available.' : parsed_response.items[item].volumeInfo.description
		book['thumbnail'] = (typeof parsed_response.items[item].volumeInfo.imageLinks === "undefined") ? 'img/noimg.png' : parsed_response.items[item].volumeInfo.imageLinks.thumbnail
		
		serialized_books.push(book)
	}
	return serialized_books
}

function createHtmlElementsFromSerializedBooks(books){
	
	let target_parent_div = document.getElementsByClassName('books_listing')
	
	for( let book in books){
		
		let container = document.createElement('div')
		container.className = 'container'
		
		let title_div = document.createElement('div')
		let title_div_content = document.createTextNode(books[book].title)
		title_div.appendChild(title_div_content)
		title_div.className = 'title'
		
		let authors_div = document.createElement('div')
		let authors_div_content = document.createTextNode(books[book].authors)
		authors_div.appendChild(authors_div_content)
		authors_div.className = 'authors'
		
		let description_div = document.createElement('div')
		let description_div_content = document.createTextNode(books[book].description)
		description_div.appendChild(description_div_content)
		description_div.className = 'description'
		
		let img_div = document.createElement('img')
		img_div.src = books[book].thumbnail
		img_div.className = 'image'
		
		container.appendChild(title_div)
		container.appendChild(authors_div)
		container.appendChild(description_div)
		container.appendChild(img_div)
		
		target_parent_div[0].appendChild(container)
	}
}

function findBooksByName(search_phrase, start_index){
    
	let complete_url = url + search_phrase + '&startIndex=' + start_index
    
	httpGetAsync(complete_url, function(cb) {
		let parsed_response = JSON.parse(cb)
		serializedBooks = serializeBooksFromResponse(cb)
		createHtmlElementsFromSerializedBooks(serializedBooks)
	})
}

function deleteCurrentSearch(){
	
	let parent_node = document.querySelector('.books_listing')
	
	if(parent_node !== null){
		parent_node.innerHTML = ""
	}
	
}

function scroll(ev){
    let st = Math.max(document.documentElement.scrollTop,document.body.scrollTop);
	if((st+document.documentElement.clientHeight)>=document.documentElement.scrollHeight ){
        start_index += 10
        findBooksByName(search_phrase, start_index)
    }
}

document.addEventListener('DOMContentLoaded', function() {
  
	[].forEach.call(document.querySelectorAll('.search_bar'), function(el) {
		el.addEventListener('change', function() {
			
			start_index = 0
			search_phrase = document.querySelectorAll('.search_bar')[0].value
			
			deleteCurrentSearch()
			
			findBooksByName(search_phrase, start_index)
		
		})
	})
    
    if(window.addEventListener){
	   window.addEventListener('scroll',scroll)
    }else if(window.attachEvent){
	   window.attachEvent('onscroll',scroll);
}
  
})
