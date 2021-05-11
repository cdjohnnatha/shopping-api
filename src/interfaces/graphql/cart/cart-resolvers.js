const cartExpirationRoutine = () => {
  // var carts = db.carts.find({ status: "expiring" })
  // for (var i = 0; i < carts.length; i++) {
  //   var cart = carts[i]

  //   for (var j = 0; j < cart.products.length; j++) {
  //     var product = cart.products[i]

  //     db.products.update({
  //       productId: product._id,
  //       "in_carts._id": cart._id,
  //       "in_carts.quantity": product.quantity
  //     }, {
  //       $inc: { quantityAvailable: item.quantity },
  //       $pull: { in_carts: { id: cart._id } }
  //     })
  //   }

  //   db.carts.update({
  //     _id: cart._id,
  //     $set: { status: 'expired' }
  //   })
  // }
}

const cartCheckout = () => {
  // db.orders.insert({
  //   createdAt: new Date(),

  //   shipping: {
  //     customer: "Peter P Peterson",
  //     address: "Longroad 1343",
  //     city: "Peterburg",
  //     region: "",
  //     state: "PE",
  //     country: "Peteonia",
  //     delivery_notes: "Leave at the gate",

  //     // tracking: {
  //     //   company: "ups",
  //     //   tracking_number: "22122X211SD",
  //     //   status: "ontruck",
  //     //   estimated_delivery: new Date()
  //     // },
  //   },

  //   payment: {
  //     method: "visa",
  //     transaction_id: "2312213312XXXTD"
  //   }

  //   products: {
  //     {quantity: 2, sku:"111445GB3", title: "Simsong mobile phone", unit_cost:1000, currency:"USDA"}
  //   }
  // })
}