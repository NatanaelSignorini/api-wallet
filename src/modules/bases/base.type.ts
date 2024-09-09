export interface FindAllProps {
  order: {
    field: string;
    direction: 'ASC' | 'DESC';
  };
  skip: number;
  take: number;
}
