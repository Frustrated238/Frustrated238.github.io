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
let lastPage = 20;
let page =  localStorage.getItem("currentPage") ? localStorage.getItem("currentPage") : 1;
localStorage.setItem("currentStoreItems", []);
cartItems = [];

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
		cartButton.addEventListener('click', addToCart);
		// console.log(cartButton);
	});
}

function createPagesBlock(currentPage, lastPage){
	let pages = document.querySelector('#pages');
	pages.innerHTML = '';

  	for (let btn = 1; btn <= 7; btn++) {
    	const button = document.createElement('button');
		if(btn == 6) {
			button.textContent = '...';
		} else if (btn == 7) {
			button.textContent = lastPage;
		} else button.textContent = btn;
		if(button.textContent == currentPage) {
			button.classList = 'border border-black rounded-[100%] w-[39px] h-[39px] flex justify-center items-center text-[18px] font-Inter leading-[18px] text-white bg-black'
		} else {
			button.classList = 'border border-black rounded-[100%] w-[39px] h-[39px] flex justify-center items-center text-[18px] font-Inter leading-[18px]';
		}
		pages.appendChild(button);
  	}
}

document.addEventListener('DOMContentLoaded', () => {
	fetchData(apiUrl, page)
	.then((data) => {
		localStorage.setItem("currentStoreItems", JSON.stringify(data.products));
		appendItemsToList(data.products);
	});
	createPagesBlock(page, lastPage);
});


const pagination = document.querySelector('#pages');
pagination.addEventListener('click', handleButtonClick);

  
function handleButtonClick(event) {
	const currentButtonValue = event.target.textContent;
	const allButtons = document.querySelectorAll('#pages button');
	const contentList = document.querySelector('#itemList');
	if (!(event.target.tagName.toLowerCase() === 'button') ||  !(/^\d+$/.test(currentButtonValue))) return;

	localStorage.setItem("currentPage", currentButtonValue);

	allButtons.forEach((button) => {
		if (button.textContent == currentButtonValue) {
			button.classList.add('bg-black','text-white');
		} else {
			button.classList.remove('bg-black','text-white');
		}
	});
	console.log(allButtons);

	contentList.innerHTML = '';
	fetchData(apiUrl, currentButtonValue)
		.then((data) => {
			localStorage.setItem("currentStoreItems", JSON.stringify(data.products));
			appendItemsToList(data.products);
		});
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

function addToCart(event) {
	console.log(event.target.id);
	let localStoreItems = JSON.parse(localStorage.getItem('currentStoreItems'));
	cartItems = JSON.parse(localStorage.getItem('shopingCart'));	
	localStoreItems.forEach((item) => {
		if(item.id == event.target.id && !(cartItems.some(obj => obj.id == event.target.id))) {
			cartItems.push(item);
			localStorage.setItem('shopingCart',JSON.stringify(cartItems));
		}
	})
	let store = document.querySelector('#cartList');
	store.innerHTML = '';
	appendItemsToCart(JSON.parse(localStorage.getItem('shopingCart')));
}

// Delete from Cart 
function deleteFromCart(event) {
	console.log(event.currentTarget);
	let localStoreItems = JSON.parse(localStorage.getItem('shopingCart'));
	const index = localStoreItems.findIndex(item => item.title === event.currentTarget.id);
	if (index !== -1) {
		localStoreItems.splice(index, 1);
	}
	localStorage.setItem('shopingCart',JSON.stringify(localStoreItems));

	let store = document.querySelector('#cartList');
	store.innerHTML = '';
	appendItemsToCart(localStoreItems);
}

// Render items in cart
function appendItemsToCart(items) {
	let wrapper = document.querySelector('#cartList');
	let totalCostNum = 0;
	items.forEach((item) => {
		let itemID = 1;
		let newItemCart = document.createElement('div');
		newItemCart.innerHTML = `
		<div id="cartItem" class="flex mt-[40px] text-[#FCF7E6] font-bold text-[14px] relative">
			<img class="w-[74px] h-[74px] border border-customBorder rounded" src="${item?.images[0]?.src ? item?.images[0]?.src : imgSrc }" alt="${item.title}">
			<div class="ml-[18px] max-w-[196px] flex flex-col justify-between">
				<p>${item.title.split(' ').slice(0, 4).join(' ')}</p>
				<p>${item.variants[0].price} KR.</p>
				<div class="flex w-[60px] justify-between">
					<button id="minusBtn">-</button>
					<p id="${itemID}"> </p>
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
		deleteBtn.addEventListener('click', deleteFromCart);
		totalCostNum += +item.variants[0].price;


	});
	const totalCost = document.querySelector('#totalCost');
	totalCost.textContent = totalCostNum;
}




