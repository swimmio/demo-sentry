---
title: Guide to adding or modifying notification strategies
---
This document will cover the topic of strategies in the Sentry codebase. We'll cover:

1. What are strategies
2. How strategies are used
3. How to add or modify strategies

<SwmSnippet path="/src/sentry/grouping/strategies/base.py" line="159">

---

# What are strategies

Strategies are defined as a class in the Sentry codebase. They are used for grouping events and have various properties and methods that define their behavior. Each strategy has an ID, a name, an interface, a score, and a function. The score determines the precedence of strategies. The function is what the strategy does when it is called.

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

<SwmSnippet path="/src/sentry/grouping/strategies/base.py" line="25">

---

# How strategies are used

Strategies are stored in a dictionary called STRATEGIES. The keys are the strategy IDs and the values are the strategy objects. This allows for easy lookup of strategies by their ID.

```python
STRATEGIES: Dict[str, "Strategy[Any]"] = {}

RISK_LEVEL_LOW = 0
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/grouping/strategies/base.py" line="327">

---

# How to add or modify strategies

New strategies can be added or existing ones can be modified using the `create_strategy_configuration` function. This function takes in an ID, a list of strategies, a list of delegates, a changelog, a boolean indicating if the strategy is hidden, a base strategy configuration, a risk level, an initial context, and an enhancements base. It returns a new strategy configuration.

```python
def create_strategy_configuration(
    id: str,
    strategies: Optional[Sequence[str]] = None,
    delegates: Optional[Sequence[str]] = None,
    changelog: Optional[str] = None,
    hidden: bool = False,
    base: Optional[Type[StrategyConfiguration]] = None,
    risk: Optional[Risk] = None,
    initial_context: Optional[ContextDict] = None,
    enhancements_base: Optional[str] = None,
) -> Type[StrategyConfiguration]:
    """Declares a new strategy configuration.

    Values can be inherited from a base configuration.  For strategies if there is
    a strategy of the same class it's replaced.  For delegates if there is a
    delegation for the same interface it's replaced.

    It's impossible to remove a strategy of a class when a base is declared (same
    for delegates).
    """

```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
