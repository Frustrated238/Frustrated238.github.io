async function fetchData(url, page = 1) {
	const fetchUrl = '' + url + page;
	return await fetch(fetchUrl).
		then((response) => {
			if (!response.ok) {
			throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
		});
}

const limit = 24;
let totalPages  = 20;
let currentPage  =  1;

// localStorage.setItem("currentStoreItems", []);
localStorage.setItem("shopingCart", JSON.stringify([]));
const apiUrl = `https://voodoo-sandbox.myshopify.com/products.json?limit=${limit}&page=`;
let imgSrc = 'http://logos-download.com/wp-content/uploads/2016/10/Shopify_logo_icon.png'


function appendItemsToList(items) {
	let wrapper = document.querySelector('#itemList');

	items.forEach((item) => {
		let newItem = document.createElement('div');
		newItem.innerHTML = `
			<div id="item" class="max-w-[300px]">
				<div class="relative">
					<img class="border w-[300px] h-[300px] border-black rounded object-fill" src="${item?.images[0]?.src ? item?.images[0]?.src : imgSrc }" alt="${item.title}">
					<p class="rounded-lg p-[8px] bg-black text-[12px] text-white font-normal leading-[12px] w-[47px] absolute top-[12px] left-[12px]">USED</p>
				</div>
				<div class="flex justify-between mt-[12px]">
					<p class="text-[14px] font-bold font-SpaceGrotesk"">${item.title.split(' ').slice(0, 3).join(' ')}</p>
					<p class="text-[14px] font-bold  font-SpaceGrotesk">Condition</p>
				</div>
				<div class="flex justify-between">
					<p class="text-[14px] font-bold font-SpaceGrotesk"">${item.variants[0].price} KR.</p>
					<p class="text-[14px] font-normal font-SpaceGrotesk">Slightly used</p>
				</div>
				<button id="${item.id}"  class="add-to-cart-btn rounded w-full p-[16px]  mt-[12px] bg-black text-center text-white font-bold text-[14px] leading-[14px] ">ADD TO CART</button>
			</div>`
		wrapper.append(newItem);
		const cartButton  =  document.getElementById(item.id);
		cartButton.addEventListener('click', addToCart(item.id));
	});
}

function renderPaginationBtns(){
	let pagesWrapper = document.querySelector('#pages');
	pagesWrapper.innerHTML = '';

	renderPageButton(1, pagesWrapper);

	if (currentPage > 1) {
		renderDots(pagesWrapper);
	}
	let startPage = Math.max(currentPage - 1, 2);
  	let endPage = Math.min(currentPage + 1, totalPages - 1);

	for (let page = startPage; page <= endPage; page++) {
		renderPageButton(page, pagesWrapper);
	}
	if (currentPage < totalPages - 4) {
		renderDots(pagesWrapper);
	}
	renderPageButton(totalPages, pagesWrapper);

}

function renderPageButton(page, container) {
	const button = document.createElement('button');
	button.classList = 'border border-black rounded-[100%] w-[39px] h-[39px] flex justify-center items-center text-[18px] font-Inter leading-[18px]';
	button.textContent = page;
	if (button.textContent == currentPage) {
		button.classList.add('bg-black','text-white');
	} else {
		button.classList.remove('bg-black','text-white');
	}
	button.addEventListener('click', () => handlePaginationClick(page));
	container.appendChild(button);
}

function renderDots(container) {
	const dots = document.createElement('span');
	dots.classList = 'border border-black rounded-[100%] w-[39px] h-[39px] flex justify-center items-center text-[18px] font-Inter leading-[18px]';
	dots.textContent = '...';
	container.appendChild(dots);
}
renderPaginationBtns();

document.addEventListener('DOMContentLoaded', () => {
	fetchData(apiUrl, currentPage)
	.then((data) => {
		localStorage.setItem("currentStoreItems", JSON.stringify(data.products));
		appendItemsToList(data.products);
	});
});
  
function handlePaginationClick(page) {
	const currentButtonValue = page;
	const allButtons = document.querySelectorAll('#pages button');
	const contentList = document.querySelector('#itemList');
	localStorage.setItem("currentPage", currentButtonValue);

	allButtons.forEach((button) => {
		if (button.textContent == currentButtonValue) {
			button.classList.add('bg-black','text-white');
		} else {
			button.classList.remove('bg-black','text-white');
		}
	});
	

	contentList.innerHTML = '';
	fetchData(apiUrl, currentButtonValue)
		.then((data) => {
			localStorage.setItem("currentStoreItems", JSON.stringify(data.products));
			appendItemsToList(data.products);
		});

	currentPage = page;
	renderPaginationBtns();
}


// Open/close shoppingCart
const openShoppingCart = document.querySelector('#shoppingCartBtn');
const closeShoppingCartBtn = document.querySelector('#closeShoppingCartBtn');
openShoppingCart.addEventListener('click', handleShoppingCart);
closeShoppingCartBtn.addEventListener('click', handleShoppingCart)

function handleShoppingCart() {
	const shoppingCartMenu = document.querySelector('#shoppingCartMenu');
	if(shoppingCartMenu.classList.contains('hidden')) {
		shoppingCartMenu.classList.remove('hidden');
		appendItemsToCart(JSON.parse(localStorage.getItem('shopingCart')));
	} else {
		shoppingCartMenu.classList.add('hidden');
		let store = document.querySelector('#cartList');
		store.innerHTML = '';
	};
}


//Add items to cart 

function addToCart(itemId) {
	return function(event) {
		let allPageItems = JSON.parse(localStorage.getItem('currentStoreItems'));
		let cartItems = JSON.parse(localStorage.getItem('shopingCart'));
		allPageItems.forEach((item) => {
			if(item.id == itemId && !(cartItems.some(obj => obj.id == itemId))) {
				item.amount = 1;
				cartItems.push(item);
				localStorage.setItem('shopingCart',JSON.stringify(cartItems));
			}
		})
		let store = document.querySelector('#cartList');
		store.innerHTML = '';
		appendItemsToCart(cartItems);
	}
}

// Delete from Cart 
function deleteFromCart(itemId) {
	return function(event) {
		let cartItems = JSON.parse(localStorage.getItem('shopingCart'));
		const index = cartItems.findIndex(item => item.id === itemId);
		if (index !== -1) {
			cartItems.splice(index, 1);
		}
		localStorage.setItem('shopingCart',JSON.stringify(cartItems));
		let store = document.querySelector('#cartList');
		store.innerHTML = '';
		appendItemsToCart(cartItems);
	}
}

// Render items in cart
function appendItemsToCart(items) {
	let wrapper = document.querySelector('#cartList');
	wrapper.innerHTML = '';
	let totalCostNum = 0;
	let amountBlockId = 0;
	items.forEach((item) => {
		let newItemCart = document.createElement('div');
		newItemCart.innerHTML = `
		<div id="cartItem" class="flex mt-[40px] text-[#FCF7E6] font-bold text-[14px] relative">
			<img class="w-[74px] h-[74px] border border-customBorder rounded" src="${item?.images[0]?.src ? item?.images[0]?.src : imgSrc }" alt="${item.title}">
			<div class="ml-[18px] max-w-[196px] flex flex-col justify-between">
				<p>${item.title.split(' ').slice(0, 4).join(' ')}</p>
				<p>${item.variants[0].price} KR.</p>
				<div id=${amountBlockId} class="flex w-[60px] justify-between">
					<button id="minusBtn">-</button>
					<p>${item.amount}</p>
					<button id="plusBtn">+</button>
				</div>
			</div>
			<button id="${item.title}">
				 <img class="absolute top-0 right-0" src="/src/img/icons/delete-bin-6-line.svg" alt="">
			</button>
		</div>
		`;
		wrapper.append(newItemCart);
		const deleteBtn  =  document.getElementById(item.title);
		const amountBlock = document.getElementById(amountBlockId++);
		deleteBtn.addEventListener('click', deleteFromCart(item.id));
		amountBlock.addEventListener('click', handleAmountChange(item.id));
		totalCostNum += +item.variants[0].price * item.amount;
	});
	const totalCost = document.querySelector('#totalCost');
	totalCost.textContent = totalCostNum.toFixed(2);
}

function handleAmountChange(itemId) {
	return function(event) {
		let button = event.target.id;
		let cartItems = JSON.parse(localStorage.getItem('shopingCart'));
		JSON.parse(localStorage.getItem('shopingCart')).forEach((item) => {
			if(item.id == itemId) {
				if(button == 'plusBtn') {
					item.amount += 1;
					cartItems.push(item);
					const index = cartItems.findIndex(item => item.id === itemId);
					if (index !== -1) {
						cartItems.splice(index, 1);
					}
				} else if (button == 'minusBtn' && item.amount > 1) {
					item.amount -= 1;
					cartItems.push(item);
					const index = cartItems.findIndex(item => item.id === itemId);
					if (index !== -1) {
						cartItems.splice(index, 1);
					}
				}
				localStorage.setItem('shopingCart',JSON.stringify(cartItems));
			}
			appendItemsToCart(cartItems);
		});		
	}
}