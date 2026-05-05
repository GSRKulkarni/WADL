 const products = [
	{
	  name: "Wireless Headphones",
	  price: "₹7,999",
	  desc: "Noise-cancelling over-ear headphones.",
	  image: "https://via.placeholder.com/60?text=HP"
	},
	{
	  name: "Smartwatch",
	  price: "₹12,999",
	  desc: "Fitness tracking smartwatch.",
	  image: "https://via.placeholder.com/60?text=SW"
	},
	{
	  name: "Gaming Mouse",
	  price: "₹2,499",
	  desc: "Ergonomic gaming mouse.",
	  image: "https://via.placeholder.com/60?text=GM"
	},
	{
	  name: "Laptop Stand",
	  price: "₹1,999",
	  desc: "Adjustable aluminium stand.",
	  image: "https://via.placeholder.com/60?text=LS"
	},
];

let currentPage =1;
const rowsPerPage =2;

function displayProducts(){
    const tbody = document.getElementById("productbody");
    tbody.innerHTML = "";

    const start = (currentPage -1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageProducts = products.slice(start,end);

    for(let prod of pageProducts){
        const row =`
        <tr>
            <td><img src="${prod.image}" alt="${prod.name}"></td>
            <td>${prod.name}</td>
            <td>${prod.price}</td>
            <td>${prod.desc}</td>
        </tr>
        `;
        tbody.innerHTML += row;
    }
    document.getElementById("pageInfo").textContent = `Page ${currentPage} of ${Math.ceil(product.length/rowsPerPage)}`;
}

function nextPage(){
    if(currentPage * rowsPerPage <product.length){
        currentPage++;
        displayProducts();
    }
}

function prevpage(){
    if(currentPage >1){
        currentPage--;
        displayProducts();
    }
}