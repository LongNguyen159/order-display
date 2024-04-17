export interface Location {
    id: number;
    description: string;
}

export interface Order {
    id: number;
    order_number: string;
    location_id: number;
    done: boolean;
    location_description: string;
  }