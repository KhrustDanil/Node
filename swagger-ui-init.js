window.onload = function() {
    const ui = SwaggerUIBundle({
      url: "http://localhost:3000/api-docs",
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      layout: "StandaloneLayout"
    });
  };
  