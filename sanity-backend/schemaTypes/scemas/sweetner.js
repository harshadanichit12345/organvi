export default {
    name: "sweetner",
    title: "Sweetner",
    type: "document",
    fields: [
      { name: "title", title: "Title", type: "string" },
      { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
      { name: "description", title: "Description", type: "text" },
      { name: "price", title: "Price", type: "number" },
      { name: "image", title: "Image", type: "image" },
      { name: "typeKey", title: "Type Key", type: "string", initialValue: "sweetner" }
    ]
  }
  