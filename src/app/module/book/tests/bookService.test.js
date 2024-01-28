const bookService = require('../book.services');
const Book = require('../book.model');

jest.mock('../book.model');

describe('updateReadingStatus', () => {
  it('updates reading status successfully', async () => {
    const mockUpdatedBook = { _id: '123', readingStatus: 'Read' };
    Book.findByIdAndUpdate.mockResolvedValue(mockUpdatedBook);

    const updatedBook = await bookService.updateReadingStatus('123', 'Read');

    expect(updatedBook).toEqual(mockUpdatedBook);
    expect(Book.findByIdAndUpdate).toHaveBeenCalledWith('123', { readingStatus: 'Read' }, { new: true });
  });

  it('throws an error if updating reading status fails', async () => {
    const errorMessage = 'Error updating reading status';
    Book.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

    await expect(bookService.updateReadingStatus('123', 'Read')).rejects.toThrow(errorMessage);
  });
});
