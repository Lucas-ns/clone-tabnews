function status(request, response) {
  response.status(200).json({ chave: "testando request com curl é" });
}

export default status;
