#contentful-migration

1.`yarn install contentful-migration`

2.Add new script to your project's `package.json`

```
"migrate": "CONTENTFUL_MANAGEMENT_API=<contentful-management-api-key> CONTENTFUL_SPACE_ID=<contentful-space-id> CONTENTFUL_ENVIRONMENT_ID=<contentful-environment-id> node ./src/contentful-migration/index.ts ${PWD}"
```

3.Run `yarn run migrate` to execute all available migrations for the listed in your .migrations file.

Example `.migrations` file:
```text
Title
Sections
```

---

Fetch existing entry data (used for initial data migration scripts)

```
const existing = await makeRequest({
      method: "GET",
      url: `/entries/BRDIKtDgILHysmp1LWWrJ`,
    }).catch(console.log);

console.log("existing: ", JSON.stringify(existing.fields));
```

Snippet for creating initial data in the content type creation migration:

```
module.exports.up = (migration, {makeRequest}) => {
  makeRequest({
    method: "PUT",
    url: `/entries/NEW_ENTRY_ID`,
    data: EXISTING_FIELDS_FROM_SNIPPET_ABOVE,
    headers: {
      'X-Contentful-Content-Type': 'CONTENT_TYPE_ID'
    }
  })
};
```
