export const mockLocalStorage = () => {
    const setItemMock = jest.fn();
    const getItemMock = jest.fn();
    const removeItemMock = jest.fn();

  
    beforeEach(() => {
      Storage.prototype.setItem = setItemMock;
      Storage.prototype.getItem = getItemMock;
      Storage.prototype.removeItem = removeItemMock;
    });
  
    afterEach(() => {
      setItemMock.mockRestore();
      getItemMock.mockRestore();
      removeItemMock.mockRestore();
    });
  
    return { setItemMock, getItemMock, removeItemMock };
  };