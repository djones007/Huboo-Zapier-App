const perform = async (z, bundle) => {
  const payload = {
    'client_order_id':bundle.inputData.clientOrderId,
    'address':{
      name:bundle.inputData.name,
      line_one:bundle.inputData.lineOne,
      line_two:bundle.inputData.lineTwo ? bundle.inputData.lineTwo : '',
      country_code:bundle.inputData.countryCode,
      postcode:bundle.inputData.postcode
    },
    lines:[]
  };

  //Build lineitems
  bundle.inputData.lineItems.forEach((l)=> {
    payload.lines.push({
      sku:l.sku,
      quantity:l.quantity,
      sales_value:{
        amount:l.amount,
        currency:bundle.inputData.currency
      }
    })
  })

  //Check for non required fields and populate if they exist
  if(bundle.inputData.city){
    payload.address.town = bundle.inputData.city;
  }
  if(bundle.inputData.email){
    payload.address.email_address = bundle.inputData.email;
  }
  if(bundle.inputData.phone){
    payload.address.phone_number = bundle.inputData.phone;
  }

  if(bundle.inputData.shippingService){
    payload.shipping_service = bundle.inputData.shippingService;
  }
  if(bundle.inputData.note){
    payload.note = bundle.inputData.note;
  }
  if(bundle.inputData.channel){
    payload.channel = bundle.inputData.channel;
  }

  z.console.log('Payload: '+ JSON.stringify(payload));
  const response = await z
    .request(`https://api.huboo.uk/v2/order`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "Accept":"application/json"
      },
    })
    .then((res) => res.json);

  return response;
};

module.exports = {
  key: "createOrder",

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: "Order",
  display: {
    label: "Create Order",
    description: "Create an Order.",
  },

  // `operation` is where we make the call to your API to do the search
  operation: {
    // This search only has one search field. Your searches might have just one, or many
    // search fields.
    inputFields: [
      {
        key: "clientOrderId",
        type: "string",
        label: "Order ID",
        required:true
      },
      {
        key:'address',
        label:'Address',
        children:[
          {
            key: "name",
            type: "string",
            label: "Name",
            required:true
          },
          {
            key: "lineOne",
            type: "string",
            label: "Address Line One",
            required:true
          },
          {
            key: "lineTwo",
            type: "string",
            label: "Address Line Two",
            required:false
          },
          {
            key: "city",
            type: "string",
            label: "City",
            required:false
          },
          {
            key: "countryCode",
            type: "string",
            label: "Country Code",
            required:true
          },
          {
            key: "postcode",
            type: "string",
            label: "Postcode",
            required:true
          },
          {
            key: "email",
            type: "string",
            label: "Email Address",
            required:false
          },
          {
            key: "phone",
            type: "string",
            label: "Phone Number",
            required:false
          },
        ]
      },
      {
        key: "lineItems",
        children:[
          {
            key: "sku",
            type: "string",
            label: "Item Sku",
            required:true
          },
          {
            key: "quantity",
            type: "string",
            label: "Quantity",
            required:true
          },
          {
            key: "amount",
            type: "string",
            label: "Amount",
            required:true
          },
        ]
      },
      {
        key: "currency",
        type: "string",
        label: "Currency",
        required:true
      },
      {
        key: "shippingService",
        type: "string",
        label: "Shipping Service",
        required:false
      },
      {
        key: "note",
        type: "text",
        label: "Contact Description",
        required:false
      },
      {
        key: "channel",
        type: "text",
        label: "Contact Description",
        required:false
      },
    ],

    perform: perform,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: {
      "id": "1001-1618395894-6076c2f608953",
      "client_order_id": "YOUR_ORDER_ID_1345",
      "lines": [
      {
      "id": 321,
      "sku": 123,
      "identifier": "YOUR_PRODUCT_IDENTIFIER",
      "quantity": 2,
      "sales_value": {},
      "batch_details": []
      },
      {
      "id": 322,
      "sku": 548,
      "identifier": "YOUR_PRODUCT_IDENTIFIER_2",
      "quantity": 1,
      "sales_value": {},
      "batch_details": []
      },
      {
      "id": 323,
      "sku": 549,
      "identifier": "YOUR_PRODUCT_IDENTIFIER_3",
      "quantity": 2,
      "sales_value": {},
      "batch_details": [ ]
      }
      ],
      "address": {
      "name": "George Smith",
      "line_one": "1 Mushroom Lane",
      "line_two": "Middletown",
      "line_three": "Uppercounty",
      "line_four": "Lowerregion",
      "town": "Bristol",
      "country_code": "GB",
      "postcode": "AB1 2CD",
      "email_address": "example@domain.com",
      "phone_number": "+44 7123456789"
      },
      "shipping_service": null,
      "tracking": [
      {},
      {}
      ],
      "status": "In Progress",
      "note": "This is my very special order note.",
      "channel": null,
      "order_options": {
      "has_dispatch_note": false
      },
      "created_at": "2021-12-25T00:00:00Z"
      },

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    /*outputFields: [
      { key: "id", label: "ID" },
      { key: "createdAt", label: "Created At" },
      { key: "name", label: "Name" },
      { key: "directions", label: "Directions" },
      { key: "authorId", label: "Author ID" },
      { key: "style", label: "Style" },
    ],*/
  },
};