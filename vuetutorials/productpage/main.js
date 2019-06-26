var app = new Vue({
	el: '#app',
	data: {
		product: 'Socks',
		desc: 'A pair of warm, fuzzy socks',
		image: './assets/vmSocks-green.jpg',
		inventory: 8,
		inStock: false,
		onSale: true,
		details: ["80% cotton", "20% poliester", "Gender-neutral"],
		variants: [
		{
			variantId: 2234,
			variantColor: "green",
			variantImage: './assets/vmSocks-green.jpg',
		},
		{
			variantId: 2235,
			variantColor: "blue",
			variantImage: './assets/vmSocks-blue.jpg',
		}],
		sizes: [
		{
			sizeId: 134,
			sizeName: "S (small)"
		},
		{
			sizeId: 135,
			sizeName: "M (medium)"
		}],
		cart: 0,

	},
	methods: {
			addToCart: function () {
				this.cart += 1
			},
			deleteFromCart: function () {
				this.cart -= 1
			},
			updateProduct: function(variantImage) {
				this.image = variantImage
			}
		}
})