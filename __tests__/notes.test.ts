import { fetchNotes } from '../lib/notes';
import { supabase } from '../lib/supabase';

jest.mock('../lib/supabase', () => {
  const rangeMock = jest.fn().mockResolvedValue({
    data: [
      {
        id: '1',
        title: 'Test note',
        content: 'Test content',
        user_id: 'user-1',
        creator_email: 'test@test.com',
        image_url: null,
        image_path: null,
        updated_at: '2026-03-22T10:00:00.000Z',
      },
    ],
    error: null,
  });

  const orderMock = jest.fn(() => ({
    range: rangeMock,
  }));

  const selectMock = jest.fn(() => ({
    order: orderMock,
  }));

  const fromMock = jest.fn(() => ({
    select: selectMock,
  }));

  return {
    supabase: {
      from: fromMock,
    },
  };
});

describe('fetchNotes', () => {
  it('fetches the first 5 notes by default', async () => {
    const result = await fetchNotes();

    expect(supabase.from).toHaveBeenCalledWith('notes');
    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(1);
  });

  it('uses the correct range for pagination', async () => {
    await fetchNotes(5, 5);

    const fromCall = (supabase.from as jest.Mock).mock.results[0].value;
    const selectCall = fromCall.select.mock.results[0].value;
    const orderCall = selectCall.order.mock.results[0].value;

    expect(orderCall.range).toHaveBeenCalledWith(5, 9);
  });
});