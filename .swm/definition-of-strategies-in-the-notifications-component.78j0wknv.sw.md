---
title: Definition of strategies in the Notifications component
---
This document will cover the process of defining strategies in the Sentry project. We'll cover:

1. The structure of strategies
2. How strategies are used in the codebase
3. The purpose and functionality of strategies.

<SwmSnippet path="/src/sentry/grouping/strategies/base.py" line="159">

---

# Structure of Strategies

The `Strategy` class is the base class for all strategies. It defines the structure of a strategy, including its id, name, interface, score, and function. It also includes methods for invoking the strategy function and getting grouping components.

```python
class Strategy(Generic[ConcreteInterface]):
    """Baseclass for all strategies."""

    def __init__(
        self,
        id: str,
        name: str,
        interface: str,
        score: Optional[int],
        func: StrategyFunc[ConcreteInterface],
    ):
        self.id = id
        self.strategy_class = id.split(":", 1)[0]
        self.name = name
        self.interface = interface
        self.score = score
        self.func = func
        self.variant_processor_func: Optional[VariantProcessor] = None

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__} id={self.id!r}>"
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/grouping/strategies/base.py" line="85">

---

# Usage of Strategies

`STRATEGIES` is a dictionary that maps strategy ids to their corresponding `Strategy` objects. This is where new strategies are registered and existing strategies are looked up.

```python
        for id in ids:
            STRATEGIES[id] = rv = Strategy(
                id=id, name=name, interface=interface.path, score=score, func=f
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
