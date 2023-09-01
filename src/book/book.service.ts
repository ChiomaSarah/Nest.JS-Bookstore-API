import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from './../auth/schemas/user.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: mongoose.Model<Book>,
  ) {}

  public async create(createBookDto: CreateBookDto, user: User): Promise<Book> {
    const data = Object.assign(createBookDto, { user: user._id });
    const newBook = await this.bookModel.create(data);
    return newBook;
  }

  public async findBooks(query: Query): Promise<Book[]> {
    // pagination
    const resultPerpage = 4;
    const currentPage = Number(query.page) || 1;
    const skip = resultPerpage * (currentPage - 1);

    // sorting
    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const books = await this.bookModel
      .find({ ...keyword })
      .limit(resultPerpage)
      .skip(skip)
      .exec();
    return books;
  }

  public async findABookById(id: string): Promise<Book> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Kindly enter the correct book ID.');
    }
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException("Oops! Couldn't find book.");
    }
    return book;
  }

  public async updateBookById(
    id: string,
    updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Kindly enter the correct book ID.');
    }

    const book = await this.bookModel.findByIdAndUpdate(id, updateBookDto, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      throw new NotFoundException("Oops! Couldn't find book.");
    }
    return book;
  }

  public async removeBookById(id: string): Promise<Book> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Kindly enter the correct book ID.');
    }
    const book = await this.bookModel.findByIdAndDelete(id);
    if (!book) {
      throw new NotFoundException("Oops! Couldn't find book.");
    }
    return book;
  }
}
