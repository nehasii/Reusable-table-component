export function applyFilters(data, filters) {
    return data.filter((row) =>
      Object.keys(filters).every((columnId) =>
        String(row[columnId]).toLowerCase().includes(String(filters[columnId]).toLowerCase())
      )
    );
  }
  