const includeApiKey = (request, z, bundle) => {
  request.headers["Authorization"] = `Bearer ${bundle.authData.apiKey}`;

  return request;
};

const checkForErrors = (response, z) => {
  // In some cases the lower levels of the code can provide better error
  // messages. If they set this flag in the request, then we should fall back
  // to them to handle the errors.
  const responseHttpStatusCode = response.status;
  // Don't do any error message checking if we get a response in the 200 status code range
  if (responseHttpStatusCode >= 200 && responseHttpStatusCode < 299) {
    return response;
  }

  // If we end up here guess we don't really have any idea what happened so we'll
  // just return the generic content.
  throw new Error(
    `Error code ${responseHttpStatusCode}: ${response.content}`
  );
};

const test = async (z,bundel) => {
const response = await z
  .request(`https://api.huboo.uk/v2/sites`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept":"application/json"
    },
  })
  .then((res) => res.json);

return response.data[0];
}

const getConnectionLabel = (z, bundle) => {
// bundle.inputData will contain what the "test" URL (or function) returns
return '';
};

module.exports = {
config: {
  // "custom" is the catch-all auth type. The user supplies some info and Zapier can
  // make authenticated requests with it
  type: "custom",

  fields: [
    {
      key: "apiKey",
      label: "API Key",
      required: true,
    },
  ],

  // The test method allows Zapier to verify that the credentials a user provides
  // are valid. We'll execute this method whenver a user connects their account for
  // the first time.
  test,

  // This template string can access all the data returned from the auth test. If
  // you return the test object, you'll access the returned data with a label like
  // `{{json.X}}`. If you return `response.data` from your test, then your label can
  // be `{{X}}`. This can also be a function that returns a label. That function has
  // the standard args `(z, bundle)` and data returned from the test can be accessed
  // in `bundle.inputData.X`.
  connectionLabel: getConnectionLabel,
},
befores: [includeApiKey],
afters: [checkForErrors],
};