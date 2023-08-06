const openShoppingCart = document.querySelector('#shoppingCartBtn');
const closeShoppingCartBtn = document.querySelector('#closeShoppingCartBtn');
openShoppingCart.addEventListener('click', toggleShopBlock);
closeShoppingCartBtn.addEventListener('click', toggleShopBlock);

const imgSrc = 'http://logos-download.com/wp-content/uploads/2016/10/Shopify_logo_icon.png';

function getLocalCartItems() {
	return JSON.parse(localStorage.getItem('shopingCart'));
}

function toggleShopBlock() {
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
function clearShopContent() {
	const wrapper = document.querySelector('#cartList');
	wrapper.innerHTML = '';
}


export function addToCart(itemId) {
	return function() {
		const allPageItems = JSON.parse(localStorage.getItem('currentStoreItems'));
		const cartItems = getLocalCartItems()
		allPageItems.forEach((item) => {
			if(item.id == itemId && !(cartItems.some(obj => obj.id == itemId))) {
				item.amount = 1;
				cartItems.push(item);
				localStorage.setItem('shopingCart',JSON.stringify(cartItems));
			}
		})
		clearShopContent();
		appendItemsToCart(cartItems);
	}
}

function deleteFromCart(itemId) {
	return function() {
		let cartItems = getLocalCartItems()
		removeFromLocalStorage(itemId, cartItems);
		localStorage.setItem('shopingCart',JSON.stringify(cartItems));
		clearShopContent();
		appendItemsToCart(cartItems);
		calcTotalPrice();
	}
}

function appendItemsToCart(items) {
	const wrapper = document.querySelector('#cartList');
	clearShopContent();
	items.forEach((item) => {
		const newItemCart = document.createElement('div');
		newItemCart.innerHTML = `
		<div id="cartItem" class="flex mt-[40px] text-[#FCF7E6] font-bold text-[14px] relative">
			<img class="w-[74px] h-[74px] border border-customBorder rounded" src="${item?.images[0]?.src ? item?.images[0]?.src : imgSrc }" alt="${item.title}">
			<div class="ml-[18px] max-w-[196px] flex flex-col justify-between">
				<p>${item.title.split(' ').slice(0, 4).join(' ')}</p>
				<p>${item.variants[0].price} KR.</p>
				<div id=${item.id + 'amount'} class="flex w-[60px] justify-between">
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
		const amountBlock = document.getElementById(item.id+ 'amount');
		const itemAmountElement = amountBlock.querySelector('p');
		deleteBtn.addEventListener('click', deleteFromCart(item.id));
		amountBlock.addEventListener('click', handleAmountChange(item.id, itemAmountElement));
		calcTotalPrice();
	});
}


function removeFromLocalStorage(itemId, localCart) {
	const index = localCart.findIndex(item => item.id === itemId);
	if (index !== -1) {
		localCart.splice(index, 1);
	}
}

function handleAmountChange(itemId, amountBlockSelector) {
	const cartItems = getLocalCartItems();
	return function(event) {
		let button = event.target.id;
		JSON.parse(localStorage.getItem('shopingCart')).forEach((item) => {
			if(item.id == itemId) {
				if(button == 'plusBtn') {
					item.amount += 1;
					cartItems.push(item);
					amountBlockSelector.innerHTML = item.amount;
					removeFromLocalStorage(item.id, cartItems);
				} else if (button == 'minusBtn' && item.amount > 1) {
					item.amount -= 1;
					cartItems.push(item);
					amountBlockSelector.innerHTML = item.amount;
					removeFromLocalStorage(item.id, cartItems);
				}
				localStorage.setItem('shopingCart',JSON.stringify(cartItems.sort()));
			}
			calcTotalPrice();
		});		
	}
}

function calcTotalPrice() {
	const totalCostNum = getLocalCartItems()
	let totalPrice = 0;
	totalCostNum.forEach((item) =>{
		totalPrice += +item.variants[0].price * +item.amount;
	} );
	const totalCost = document.querySelector('#totalCost');
	totalCost.textContent = totalPrice.toFixed(2);
}
