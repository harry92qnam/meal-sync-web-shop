import { PlusIcon } from '@/components/common/PlusIcon';
import PageableModel from '@/types/models/PageableModel';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoChevronDown } from 'react-icons/io5';

export interface TableCustomFilter {
  label: string;
  mappingField: string;
  options: { key: number; desc: string }[];
  selectionMode: number;
  selectedValues: Set<number>;
  handleFunc: (values: Selection) => void;
}

type TableCustomProps = {
  // data
  placeHolderSearch: string;
  description: string;
  columns: Array<{ name: string; key: string; sortable?: boolean }>;
  arrayData: { [key: string]: any }[];
  // arrayDataColumns: Array<{ name: string; uid: string; sortable?: boolean; imageable?: boolean }>;
  renderCell: (item: any, columnKey: React.Key) => ReactNode;
  selectionMode: 'multiple' | 'single';

  // search and paging
  searchHandler: (value: string) => void;
  pagination: PageableModel;
  goToPage: (index: number) => void;
  setPageSize: (size: number) => void;

  // optional
  filters?: TableCustomFilter[];
  isFilter?: boolean;

  // actions
  handleRowClick?: (id: number) => void;
  handleAddNew?: () => void;
};

export default function TableCustom({
  placeHolderSearch,
  description,
  columns,
  arrayData,
  renderCell,
  selectionMode,

  searchHandler,
  pagination,
  goToPage,
  setPageSize,

  isFilter = true,
  filters = [],
  handleRowClick,
  handleAddNew,
}: TableCustomProps) {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const loadPreviousPage = () => {
    goToPage(page - 1);
    setPage(page - 1);
  };
  const loadNextPage = () => {
    goToPage(page + 1);
    setPage(page + 1);
  };

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    searchHandler('');
    setPage(1);
  }, []);
  console.dir(selectedKeys);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end gap-8">
          <Input
            isClearable
            className="w-full flex-1"
            placeholder={placeHolderSearch}
            startContent={<CiSearch />}
            value={searchText}
            onClear={() => {
              setSearchText('');
              searchHandler('');
            }}
            onValueChange={(value: string) => {
              setSearchText(value);
              searchHandler(value);
            }}
          />
          {isFilter && (
            <div className="flex gap-3">
              {filters.map((filter, index) => (
                <Dropdown key={index}>
                  <DropdownTrigger className="hidden sm:flex">
                    <Button endContent={<IoChevronDown className="text-small" />} variant="flat">
                      {filter.label}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Filter Options"
                    closeOnSelect={false}
                    selectedKeys={filter.selectedValues}
                    selectionMode={filter.selectionMode == 1 ? 'single' : 'multiple'}
                    onSelectionChange={(selected) => {
                      filter.handleFunc(selected);
                    }}
                  >
                    {filter.options.map((option) => (
                      <DropdownItem key={option.key} className="capitalize">
                        {option.desc}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              ))}
            </div>
          )}
          {handleAddNew && (
            <Button
              type="button"
              color="primary"
              className=" text-secondary py-[19.5px] text-medium"
              endContent={<PlusIcon />}
              size="sm"
              onClick={handleAddNew}
            >
              Tạo mới
            </Button>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-default-400 text-small mr-4">
              Tổng cộng có {arrayData.length} {description}
            </span>
            {selectionMode === 'multiple' && selectedKeys && (
              <Button className="block">Nhận tất cả</Button>
            )}
          </div>
          <label className="flex items-center text-default-400 text-small">
            Lượng dữ liệu / trang:
            <select className="bg-transparent text-base" onChange={onRowsPerPageChange}>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [onClear, searchHandler, arrayData.length, pagination, filters]);

  const bottomContent = useMemo(() => {
    return (
      <div className=" py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400"></span>
        <Pagination
          showControls
          showShadow
          color="primary"
          page={page}
          total={pagination?.totalOfPages ?? 0}
          onChange={(index: number) => {
            goToPage(index);
            setPage(index);
          }}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={!pagination?.hasPrevious}
            size="sm"
            onPress={() => loadPreviousPage()}
          >
            Trang trước
          </Button>
          <Button isDisabled={!pagination?.hasNext} size="sm" onPress={() => loadNextPage()}>
            Trang sau
          </Button>
        </div>
      </div>
    );
  }, [page, pagination]);

  return (
    <>
      <Table
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        selectedKeys={selectedKeys}
        selectionMode={selectionMode}
        topContent={topContent}
        topContentPlacement="outside"
        layout={selectionMode === 'single' ? 'fixed' : 'auto'}
        shadow="md"
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={columns} className="text-center">
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === 'actions' ? 'end' : 'center'}
              allowsSorting={column?.sortable}
              className={column.key === 'id' ? 'w-20' : ''}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent="Không có dữ liệu" items={arrayData}>
          {(item) => (
            <TableRow key={item.id} onClick={() => handleRowClick?.(item.id)}>
              {columns.map((column) => (
                <TableCell key={column.key} className="text-center">
                  {renderCell(item, column.key)}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
