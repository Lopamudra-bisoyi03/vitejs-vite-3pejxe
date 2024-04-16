import React, { useState } from 'react';

// SortByComponent component
function SortByComponent({ sortOrder, onSortOrderChange }) {
  return (
    <div>
      <span
        onClick={() => onSortOrderChange('asc')}
        style={{ cursor: 'pointer' }}
      >
        ▲
      </span>
      <span
        onClick={() => onSortOrderChange('desc')}
        style={{ cursor: 'pointer' }}
      >
        ▼
      </span>
    </div>
  );
}

// ProductTable component
function ProductTable({
  products,
  filterText,
  inStockOnly,
  sortBy,
  sortOrder,
  onSortChange,
}) {
  // Filter products based on filter text and stock availability
  const filteredProducts = products.filter((product) => {
    if (inStockOnly && !product.stocked) {
      return false;
    }
    return product.name.toLowerCase().includes(filterText.toLowerCase());
  });

  // Group products by category
  const groupedProducts = filteredProducts.reduce((groups, product) => {
    const { category } = product;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {});

  // Sort products within each category based on the selected sorting criteria
  for (const category in groupedProducts) {
    groupedProducts[category] = groupedProducts[category].sort((a, b) => {
      const comparison = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'name') {
        return comparison * a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        return (
          comparison *
          (parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1)))
        );
      }
      return 0;
    });
  }

  // Rendered rows
  const rows = [];
  for (const category in groupedProducts) {
    rows.push(<ProductCategoryRow category={category} key={category} />);
    groupedProducts[category].forEach((product) => {
      rows.push(<ProductRow product={product} key={product.name} />);
    });
  }

  // Table header with sorting functionality
  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => onSortChange('name')}>Name</th>
          <th>Price</th>
          <th>
            <SortByComponent
              sortOrder={sortOrder}
              onSortOrderChange={(order) => onSortChange('price', order)}
            />
          </th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

// ProductCategoryRow component
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

// ProductRow component
function ProductRow({ product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: 'red' }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

// FilterableProductTable component
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSortChange = (sortByField, order) => {
    setSortBy(sortByField);
    setSortOrder(order);
  };

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
    </div>
  );
}

// SearchBar component
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        style={{ width: '50%' }}
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />{' '}
        Only show products in stock
      </label>
    </form>
  );
}

// Define products
const PRODUCTS = [
  { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
  { category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit' },
  { category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit' },
  { category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach' },
  { category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin' },
  { category: 'Vegetables', price: '$1', stocked: true, name: 'Peas' },
];

// App component (entry point)
function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}

export default App;
