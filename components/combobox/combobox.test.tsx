import { describe, test, expect } from "vitest";
import { matchSorter } from "match-sorter";

describe.skip('Playground', () => {
  test('Seharusnya terurut', () => {
    const list = [
      "appl",
      "C apple",
      "B apple",
      "A apple",
      "app",
      "applebutter",
    ];

    const unsortedList = [...list];
    const sortedList = matchSorter(list, '');
    
    expect(unsortedList).toEqual(list);
    expect(sortedList).not.toEqual(list);

    console.log(sortedList);
  })
})

describe.todo('Combobox Component (tanpa form)', () => {
  test.todo('Memilih satu option');
  test.todo('Memilih beberapa options');
  test.todo('Search Options');
  test.todo("Default Values");
});

describe.todo('Combobox Component (dengan form)', () => {
  test.todo('Label');
  test.todo('Description');
  test.todo('Pesan Error');
  test.todo("Default Values");
})