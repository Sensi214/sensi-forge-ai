// Add this reference object at the top of server.js
const PRODUCT_SPECS = {
  'hoodie': { width: 2500, height: 2500, sku: 'SKU-11009' },
  'poster': { width: 3600, height: 5400, sku: 'SKU-7976' },
  'tote':   { width: 2392, height: 2528, sku: 'SKU-7988' }
};

app.post('/forge-merch', async (req, res) => {
    const { userImage, productType } = req.body;
    const spec = PRODUCT_SPECS[productType] || PRODUCT_SPECS['hoodie'];

    const output = await replicate.run(
      "tencentarc/instant-id-multicontrolnet:35324a7df2397e6e57dfd8f4f9d2910425f5123109c8c3ed035e769aeff9ff3c",
      {
        input: {
          face_image: userImage,
          prompt: `A professional apparel design for a ${productType}, high resolution, 8k`,
          // We tell the AI to aim for the InkedJoy dimensions
          width: spec.width,
          height: spec.height
        }
      }
    );
    res.json({ success: true, imageUrl: output[0] });
});
