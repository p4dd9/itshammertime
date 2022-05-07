import { WithId } from 'mongodb';
import { ProductSku } from '../../../frontend/src/types/products';

export default interface UserDTO extends WithId<Document> {
	id: string;
	bit_count: number;
	products: ProductSku[];
}
