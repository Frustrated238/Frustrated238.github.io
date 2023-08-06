import { addToCart } from "./manageCart.js"; 

export function appendItemsToList(items) {
	const wrapper = document.querySelector('#itemList');
	const imgSrc = 'http://logos-download.com/wp-content/uploads/2016/10/Shopify_logo_icon.png';
	items.forEach((item) => {
		const newItem = document.createElement('div');
		newItem.innerHTML = `
			<div id="item" class="w-[342px] sm:w-[300px]">
				<div class="relative">
					<img class="border w-[342px]  sm:w-[300px] h-[300px] border-black rounded object-cover" src="${item?.images[0]?.src ? item?.images[0]?.src : imgSrc }" alt="${item.title}">
					<p class="rounded-lg p-[8px] bg-black text-[12px] text-white font-normal leading-[12px] w-[47px] absolute top-[12px] left-[12px]">USED</p>
				</div>
				<div class="flex justify-between mt-[12px]">
					<p class="text-[14px] font-bold font-SpaceGrotesk">${item.title.split(' ').slice(0, 3).join(' ')}</p>
					<p class="text-[14px] font-bold  font-SpaceGrotesk">Condition</p>
				</div>
				<div class="flex justify-between">
					<p class="text-[14px] font-bold font-SpaceGrotesk">${item.variants[0].price} KR.</p>
					<p class="text-[14px] font-normal font-SpaceGrotesk">Slightly used</p>
				</div>
				<button id="${item.id}"  class="add-to-cart-btn rounded w-full p-[16px]  mt-[12px] bg-black text-center text-white font-bold text-[14px] leading-[14px]">ADD TO CART</button>
			</div>`
		wrapper.append(newItem);
		const cartButton  =  document.getElementById(item.id);
		cartButton.addEventListener('click', addToCart(item.id));
	});
}