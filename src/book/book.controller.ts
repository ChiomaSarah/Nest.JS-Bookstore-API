import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schemas/book.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseGuards(AuthGuard())
  public async addBook(
    @Body() createBookDto: CreateBookDto,
    @Req() req,
  ): Promise<Book> {
    return this.bookService.create(createBookDto, req.user);
  }

  @Get()
  public async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
    return this.bookService.findBooks(query);
  }

  @Get(':id')
  public async getBook(@Param('id') id: string): Promise<Book> {
    return this.bookService.findABookById(id);
  }

  @Patch(':id')
  public async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateBookById(id, updateBookDto);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    return this.bookService.removeBookById(id);
  }
}
