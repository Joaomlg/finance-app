import React, { useState } from 'react';
import RowContent from '../../../components/RowContent';
import SelectableChip from '../../../components/SelectableChip';
import Switch from '../../../components/Switch';
import Text from '../../../components/Text';
import TextButton from '../../../components/TextButton';
import { Category, WalletGroup, WalletType, WalletTypeList } from '../../../models';
import { walletTypeText } from '../../../utils/text';
import { TransactionFilters } from '../../../utils/transaction';
import { ChipsContainer, Section, SectionHeader } from './styles';

export interface TransactionFilterSheetProps {
  initialFilters: TransactionFilters;
  categories: Category[];
  walletGroups: WalletGroup[];
  onChange: (filters: TransactionFilters) => void;
}

const toggleValue = <T,>(values: T[], value: T) => {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
};

const TransactionFilterSheet: React.FC<TransactionFilterSheetProps> = ({
  initialFilters,
  categories,
  walletGroups,
  onChange,
}) => {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilters = (newFilters: Partial<TransactionFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onChange(updatedFilters);
  };

  return (
    <>
      <Section>
        <SectionHeader>
          <Text typography="title">Categoria</Text>
          <TextButton
            text="Limpar"
            color="textLight"
            onPress={() => updateFilters({ categoryIds: [] })}
          />
        </SectionHeader>
        <ChipsContainer>
          {categories.map((category) => (
            <SelectableChip
              key={category.id}
              text={category.name}
              selected={filters.categoryIds.includes(category.id)}
              onPress={() =>
                updateFilters({ categoryIds: toggleValue(filters.categoryIds, category.id) })
              }
            />
          ))}
        </ChipsContainer>
      </Section>
      <Section>
        <SectionHeader>
          <Text typography="title">Carteira</Text>
          <TextButton
            text="Limpar"
            color="textLight"
            onPress={() => updateFilters({ walletGroupIds: [] })}
          />
        </SectionHeader>
        <ChipsContainer>
          {walletGroups.map((walletGroup) => (
            <SelectableChip
              key={walletGroup.id}
              text={walletGroup.name}
              selected={filters.walletGroupIds.includes(walletGroup.id)}
              onPress={() =>
                updateFilters({
                  walletGroupIds: toggleValue(filters.walletGroupIds, walletGroup.id),
                })
              }
            />
          ))}
        </ChipsContainer>
      </Section>
      <Section>
        <SectionHeader>
          <Text typography="title">Tipo de carteira</Text>
          <TextButton
            text="Limpar"
            color="textLight"
            onPress={() => updateFilters({ walletTypes: [] })}
          />
        </SectionHeader>
        <ChipsContainer>
          {WalletTypeList.map((walletType: WalletType) => (
            <SelectableChip
              key={walletType}
              text={walletTypeText[walletType]}
              selected={filters.walletTypes.includes(walletType)}
              onPress={() =>
                updateFilters({ walletTypes: toggleValue(filters.walletTypes, walletType) })
              }
            />
          ))}
        </ChipsContainer>
      </Section>
      <Section>
        <Text typography="title">Opções adicionais</Text>
        <RowContent text="Exibir transações ignoradas">
          <Switch
            value={filters.showIgnored}
            onValueChange={(value) => updateFilters({ showIgnored: value })}
          />
        </RowContent>
      </Section>
    </>
  );
};

export default TransactionFilterSheet;
