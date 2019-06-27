Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: true
		},
		cart: "cart"
	},
	template: `
	<div class="product">
			<div class="product-image">
				<img v-bind:src="image">
			</div>
			<div class="product-info">
				<h1>{{ title }} <span class="muted" v-if="onSale" v-show="inStock">On Sale!</span></h1>
				
				<p v-if="inStock > 10">In Stock</p>
				<p v-else-if="inStock <= 10 && inStock > 0">Almost Sold Out!</p>
				<p v-else>Out of Stock</p>
				<p>Shipping: {{ shipping }}</p>

				<br>

				<p>{{ desc }}</p>

				<ul>
					<li v-for="detail in details">{{ detail }}</li>
				</ul>

		        <div v-for="(variant, index) in variants" 
		             :key="variant.variantId"
		             class="color-box"
		             :style="{ backgroundColor: variant.variantColor }"
		        	 @mouseover="updateProduct(index)">
		        </div>

		        <ul >
					<li v-for="size in sizes" :key="size.sizeId">{{ size.sizeName }}</li>
				</ul>

				<button v-on:click="addToCart" 
				        :disabled="!inStock"
				        :class="{ disabledButton: !inStock }">Add to Cart</button>
				<button @click="deleteFromCart">Delete from Cart</button>

			</div>	
			<div class="productreview">
			
			    <product-tabs :reviews="reviews"></product-tabs>
			       
			</div>		
		
		</div>
	`,
	data() {
		return {
			brand: 'Vue Mastery',
			product: 'Socks',
			desc: 'A pair of warm, fuzzy socks',
			selectedVariant: 0,
			onSale: true,
			details: ["80% cotton", "20% poliester", "Gender-neutral"],
			variants: [
			{
				variantId: 2234,
				variantColor: "green",
				variantImage: './assets/vmSocks-green.jpg',
				variantQuantity: 8
			},
			{
				variantId: 2235,
				variantColor: "blue",
				variantImage: './assets/vmSocks-blue.jpg',
				variantQuantity: 0
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
			reviews: []
	
		}
	}, 
	methods: {
			addToCart: function () {
				this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
			},
			deleteFromCart: function () {
				this.$emit('del-from-cart', this.variants[this.selectedVariant].variantId)
			},
			updateProduct: function(index) {
				this.selectedVariant = index
			}
	},
	computed: {
		title() {
			return this.brand + ' ' + this.product
		},
		image() {
			return this.variants[this.selectedVariant].variantImage
		},
		inStock() {
			return this.variants[this.selectedVariant].variantQuantity
		},
		shipping() {
			if (this.premium) {
				return "Free"
			}
			return 2.99
		}
	 },
	 mounted() {
		 eventBus.$on('review-submitted', productReview => {
			this.reviews.push(productReview)
		 })
	 }

})

Vue.component('product-review', {
	template: `
	
	<form class="review-form" @submit.prevent="onSubmit">
	<p v-if="errors.length">
		   <b>Please correct the following error(s):</b>
		   <ul>
			 <li v-for="error in errors">{{ error }}</li>
		   </ul>
		 </p>
	<p>
	  <label for="name">Name:</label>
	  <input id="name" v-model="name" placeholder="name">
	</p>
	
	<p>
	  <label for="review">Review:</label>      
	  <textarea id="review" v-model="review"></textarea>
	</p>
	
	<p>
	  <label for="rating">Rating:</label>
	  <select id="rating" v-model.number="rating">
		<option>5</option>
		<option>4</option>
		<option>3</option>
		<option>2</option>
		<option>1</option>
	  </select>
	</p>
		
	<p>
	  <input type="submit" value="Submit">  
	</p>    
  
  </form>
	`,
	data() {
	  return {
		name: null,
        review: null,
		rating: null,
		errors: []
	  }
	},
	methods: {
		onSubmit() {
			if(this.name && this.review && this.rating) {
			  let productReview = {
				name: this.name,
				review: this.review,
				rating: this.rating
			  }
			  eventBus.$emit('review-submitted', productReview)
			  this.name = null
			  this.review = null
			  this.rating = null
			} else {
			  if(!this.name) this.errors.push("Name required.")
			  if(!this.review) this.errors.push("Review required.")
			  if(!this.rating) this.errors.push("Rating required.")
			}
		  }
	}

  }) 

Vue.component('product-tabs', {
	props: {
		reviews: {
		  type: Array,
		  required: false
		}
	},
	template: `
	<div>
	
	  <div>
		<span class="tab" 
			  v-for="(tab, index) in tabs"
			  @click="selectedTab = tab" 
			  :class="{ activeTab: selectedTab === tab }" 
		>{{ tab }}</span>
	  </div>
	  
	  <div v-show="selectedTab === 'Reviews'">  
		  <p v-if="!reviews.length">There are no reviews yet.</p>
		  <ul v-else>
			  <li v-for="(review, index) in reviews" :key="index">
				<p>{{ review.name }}</p>
				<p>Rating:{{ review.rating }}</p>
				<p>{{ review.review }}</p>
			  </li>
		  </ul>
	  </div>
	  <div v-show="selectedTab === 'Make a Review'">
          <product-review ></product-review>
      	</div>
	  
	</div>
`,
	data() {
	  return {
		tabs: ['Reviews', 'Make a Review'],
		selectedTab: 'Reviews' //set from @click     
	  }
	}
})


var eventBus = new Vue()

  var app = new Vue({
	el: '#app',
	data: {
		premium: false,
		cart: [],
	},
	methods: {
		addToCart(id) {
			this.cart.push(id)
		},
		delFromCart(id) {
			this.cart.splice(this.cart.indexOf(id), 1 );
		}
	}
})