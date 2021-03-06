import math
from unittest.mock import Mock

from sentry.utils.cursors import Cursor, build_cursor


def build_mock(**attrs):
    obj = Mock()
    for key, value in attrs.items():
        setattr(obj, key, value)
    obj.__repr__ = lambda x: repr(attrs)
    return obj


def test_build_cursor():
    event1 = build_mock(id=1.1, message="one")
    event2 = build_mock(id=1.1, message="two")
    event3 = build_mock(id=2.1, message="three")

    results = [event1, event2, event3]

    def item_key(key, for_prev=False):
        return int(math.floor(key.id))

    cursor_kwargs = {"key": item_key, "limit": 1}

    cursor = build_cursor(results, **cursor_kwargs)
    assert isinstance(cursor.next, Cursor)
    assert cursor.next
    assert isinstance(cursor.prev, Cursor)
    assert not cursor.prev
    assert list(cursor) == [event1]

    cursor = build_cursor(results[1:], cursor=cursor.next, **cursor_kwargs)
    assert isinstance(cursor.next, Cursor)
    assert cursor.next
    assert isinstance(cursor.prev, Cursor)
    assert cursor.prev
    assert list(cursor) == [event2]

    cursor = build_cursor(results[2:], cursor=cursor.next, **cursor_kwargs)
    assert isinstance(cursor.next, Cursor)
    assert not cursor.next
    assert isinstance(cursor.prev, Cursor)
    assert cursor.prev
    assert list(cursor) == [event3]
