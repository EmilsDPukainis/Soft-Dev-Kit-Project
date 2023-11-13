import React from 'react';

const AdminProductTable = ({ adminProducts, selectedCategoryId, categories, editProductId, editedProduct, handleEditAdminProduct, handleDeleteAdminProduct, handleSaveAdminProduct, setEditedProduct }) => {
  return (
    <>
      <table className="admin-product-table">
        <thead>
          <tr>
          <th style={{ width: '5%' }}>ID</th>
            <th style={{ width: '15%' }}>Name</th>
            <th style={{ width: '40%' }}>Description</th>
            <th style={{ width: '5%' }}>Price</th>
            <th style={{ width: '5%' }}>Amount</th>
            <th style={{ width: '12%' }}>Category</th>
            <th style={{ width: '15%' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {adminProducts
            .filter((product) => !selectedCategoryId || product.category_id === selectedCategoryId)
            .map((product) => (
              <tr key={product.product_id} className="admin-product-row">
                <td className="admin-product-cell">{product.product_id}</td>
                <td className="admin-product-cell">
                  {editProductId === product.product_id ? (
                    <input
                      type="text"
                      value={editedProduct.product_name}
                      onChange={(e) => setEditedProduct({ ...editedProduct, product_name: e.target.value })}
                    />
                  ) : (
                    product.product_name
                  )}
                </td>
                <td className="admin-product-cell">
                  {editProductId === product.product_id ? (
                    <input
                      type="text"
                      value={editedProduct.description}
                      onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td className="admin-product-cell">
                  {editProductId === product.product_id ? (
                    <input
                      type="text"
                      value={editedProduct.price}
                      onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                    />
                  ) : (
                    product.price
                  )}
                </td>
                <td className="admin-product-cell">
                  {editProductId === product.product_id ? (
                    <input
                      type="text"
                      value={editedProduct.amount}
                      onChange={(e) => setEditedProduct({ ...editedProduct, amount: e.target.value })}
                    />
                  ) : (
                    product.amount
                  )}
                </td>
                <td className="admin-product-cell">
                  {editProductId === product.product_id ? (
                    <select
                      value={editedProduct.category_id}
                      onChange={(e) => setEditedProduct({ ...editedProduct, category_id: e.target.value })}
                      onClick={(e) => setEditedProduct({ ...editedProduct, category_id: e.target.value })}
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    product.category_id !== undefined ? (
                      product.category_id !== '' && categories.some((category) => category.category_id === product.category_id) ? (
                        categories.find((category) => category.category_id === product.category_id)?.category_name || 'Uncategorized'
                      ) : (
                        'Uncategorized'
                      )
                    ) : (
                      'Uncategorized'
                    )
                  )}
                </td>
                <td className="admin-product-cell">
                  {editProductId === product.product_id ? (
                    <>
                      <button onClick={() => handleSaveAdminProduct(product.product_id)}>Save</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditAdminProduct(product.product_id)}>Edit</button>
                      <button onClick={() => handleDeleteAdminProduct(product.product_id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default AdminProductTable;
