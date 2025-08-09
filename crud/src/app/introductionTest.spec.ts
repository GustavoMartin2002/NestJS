describe('introduction to tests',() => {
  test('add number1 + number2 and the result will be 3', () => {
    // Arrange-Act-Assert
    // Configure - Arrange
    const number1 = 1;
    const number2 = 2;
    
    // Action - act
    const result = number1 + number2;

    // check expected action - Assert
    expect(result).toBe(3);
  });
});