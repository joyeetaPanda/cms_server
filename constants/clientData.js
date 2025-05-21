// https://inorbitcontactmanagement.kraheja.com

// ---------MS Graph IDs Samishti--------

const client_id_teams = "7d203557-0b58-4cc6-a0e6-ea307cab4fe2";
const client_secret_teams = "eeQ8Q~w-lwo1ECTLrdy7X7FiArU6O8MZEoxbNcrb";
const scope_teams = "https://graph.microsoft.com/.default";
const tenant_id = "4a65d39e-b3a8-402e-86b0-c1316ba372ba";

// ---------MS Graph IDs KRC--------

// const client_id_teams = "e67b6328-bc60-40cc-a590-2fa1ace9388f";
// const client_secret_teams = "pmf8Q~jTuYih7VCOGqEEqhtgKC2hPRC4TM64ccnP";
// const scope_teams = "https://graph.microsoft.com/.default";
// const tenant_id = "adf953e1-1575-46ec-8398-5d4c7a540570";

//-----------sharepoint---------
const grant_type = "client_credentials";
// ----------------
// samishti
// const client_id =
//   "81ddd857-7787-49f1-bd20-be549222d151@4a65d39e-b3a8-402e-86b0-c1316ba372ba";
// const client_secret = "gvb9XTnWgymkNy15pgL0nYpYSJMQehBhy8He2ojOjUk=";
// const resource =
//   "00000003-0000-0ff1-ce00-000000000000/samishti.sharepoint.com@4a65d39e-b3a8-402e-86b0-c1316ba372ba";
// const tenant = "samishti.sharepoint.com";
// const site = "contactmanagementsystem_test";
// const resourceId = "4a65d39e-b3a8-402e-86b0-c1316ba372ba";

// ----------------
// KRC Production
// const client_id =
//   "3739e88f-b86e-4800-a47e-e73fb01feae4@adf953e1-1575-46ec-8398-5d4c7a540570";
// const client_secret = "g5omt5SPpXamABGa/Y2k3KXugE0KynWTRmqnZFgdQq0=";
// const resource =
//   "00000003-0000-0ff1-ce00-000000000000/kraheja.sharepoint.com@adf953e1-1575-46ec-8398-5d4c7a540570";
// const tenant = "kraheja.sharepoint.com";
// const site = "InorbitContactManagementSystem";
// const resourceId = "adf953e1-1575-46ec-8398-5d4c7a540570";
// -----------------
// KRC Testing
const client_id =
  "430e1bf2-7683-4e66-bdb3-144ec5d99a3a@adf953e1-1575-46ec-8398-5d4c7a540570";
const client_secret = "69y7F/LjfseX53Ykg2u6P5GyvHobbTV/Y1hYvCCEl9w=";
const resource =
  "00000003-0000-0ff1-ce00-000000000000/kraheja.sharepoint.com@adf953e1-1575-46ec-8398-5d4c7a540570";
const tenant = "kraheja.sharepoint.com";
const site = "InorbitContactManagementSystem_Dev";
const resourceId = "adf953e1-1575-46ec-8398-5d4c7a540570";
const sharepoint_app_client_id = "1cd3115e-4169-4449-88f7-ee72549534d3";
const scope = "https://kraheja.sharepoint.com/.default";
const client_assertion_type =
  "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";
module.exports = {
  grant_type,
  client_id,
  client_secret,
  resource,
  tenant,
  site,
  resourceId,
  client_id_teams,
  client_secret_teams,
  scope_teams,
  tenant_id,
  sharepoint_app_client_id,
  scope,
  client_assertion_type,
};
