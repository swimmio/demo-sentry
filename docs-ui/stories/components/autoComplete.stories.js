import AutoComplete from 'sentry/components/autoComplete';

const items = [
  {
    name: 'Apple',
  },
  {
    name: 'Pineapple',
  },
  {
    name: 'Orange',
  },
];

export default {
  title: 'Components/Forms/Auto Complete',
  parameters: {
    controls: {hideNoControlsWarning: true},
  },
};

export const Input = () => (
  <AutoComplete itemToString={item => item.name}>
    {({
      getRootProps,
      getInputProps,
      getMenuProps,
      getItemProps,
      inputValue,
      highlightedIndex,
      isOpen,
    }) => {
      return (
        <div {...getRootProps({style: {position: 'relative'}})}>
          <input {...getInputProps({})} />

          {isOpen && (
            <div
              {...getMenuProps({
                style: {
                  boxShadow:
                    '0 1px 4px 1px rgba(47,40,55,0.08), 0 4px 16px 0 rgba(47,40,55,0.12)',
                  position: 'absolute',
                  backgroundColor: 'white',
                  padding: '0',
                },
              })}
            >
              <div>
                {items
                  .filter(
                    item => item.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                  )
                  .map((item, index) => (
                    <div
                      key={item.name}
                      {...getItemProps({
                        item,
                        index,
                        style: {
                          cursor: 'pointer',
                          padding: '6px 12px',
                          backgroundColor:
                            index === highlightedIndex
                              ? 'rgba(0, 0, 0, 0.02)'
                              : undefined,
                        },
                      })}
                    >
                      {item.name}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      );
    }}
  </AutoComplete>
);

Input.parameters = {
  docs: {
    description: {
      story: 'Autocomplete on an input',
    },
  },
};
