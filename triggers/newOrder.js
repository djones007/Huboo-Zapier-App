const callApi = async (z,params) => {
  const response = await z
  .request(`https://api.huboo.uk/v2/orders`, {
      method: "GET",
      params:params,
      headers: {
        "Content-Type": "application/json",
        "Accept":"application/json"
      },
  })
  .then((res) => res.json);
  return response;
}

const perform = async (z, bundle) => {
  let params = {
    per_page:250
  };

  if(bundle.inputData.status){
    params.statuses = bundle.inputData.status
  }

  const page1 = await z
    .request(`https://api.huboo.uk/v2/orders`, {
      method: "GET",
      params: params,
      headers: {
        "Content-Type": "application/json",
        "Accept":"application/json"
      },
    })
    .then((res) => res.json);

  params.page = page1.meta.last_page - 1;

  z.console.log('Params: ' + JSON.stringify(params));

  let orders = [],
      ignore = bundle.inputData.ignore;

  do {
    const response = await callApi(z,params);
    if (response.data.length > 0) {
       orders.push(...response.data);
       //z.console.log('Orders Length Paginated Call: ' + orders.length);
    }
    let nextPage = params.page + 1;

    params.page = nextPage;
  } while (params.page <= page1.meta.last_page);

  if(bundle.inputData.ignore){
    //z.console.log('Filter: ' + JSON.stringify(bundle.inputData.ignore));
    orders = orders.filter((o) => {
      let c = false;
      ignore.forEach((i) => {
        if(o.client_order_id && o.client_order_id.indexOf(i) == -1){
          c=true;
        }
      })
      return c;
   })
  }

  z.console.log('Orders Length: ' + orders.length);

  return orders;
};

module.exports = {
  key: "newOrder",

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: "Order",
  display: {
    label: "New Order",
    description: "Triggers on a new order.",
  },

  // `operation` is where we make the call to your API to do the search
  operation: {
    // This search only has one search field. Your searches might have just one, or many
    // search fields.
    inputFields: [
      {
        key: "status",
        type: "string",
        label: "Status to Filter By",
        required:false,
        choices:{
          complete:'Complete',
          in_progress:'In Progress',
          hold:'Hold',
          cancelled:'Cancelled',
          error:'Error'
        }
      },
      {
        key:"ignore",
        type:'string',
        label:'Strings to ignore if they are in an OrderID',
        required:false,
        list:true
      }
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