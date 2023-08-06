export async function fetchData(page = 1) {
	const fetchUrl = 'https://voodoo-sandbox.myshopify.com/products.json?limit=24&page=' + page;
	return await fetch(fetchUrl, {method: 'GET', mode: 'cors'}).
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