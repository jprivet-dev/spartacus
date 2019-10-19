import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { ProductAdapter } from './product.adapter';
import { ProductConnector } from './product.connector';
import createSpy = jasmine.createSpy;

class MockProductAdapter implements ProductAdapter {
  load = createSpy('ProductAdapter.load').and.callFake(code =>
    of('product' + code)
  );
  loadMany = createSpy('ProductAdapter.loadMany').and.callFake(
    products => products
  );
}

describe('ProductConnector', () => {
  let service: ProductConnector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ProductAdapter, useClass: MockProductAdapter }],
    });

    service = TestBed.get(ProductConnector as Type<ProductConnector>);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get should call adapter', () => {
    const adapter = TestBed.get(ProductAdapter as Type<ProductAdapter>);

    let result;
    service.get('333').subscribe(res => (result = res));
    expect(result).toBe('product333');
    expect(adapter.load).toHaveBeenCalledWith('333', '');
  });

  it('getMany should call adapter', () => {
    const adapter = TestBed.get(ProductAdapter as Type<ProductAdapter>);

    const products = [{ code: '333', scope: 'test' }];

    const result = service.getMany(products);
    expect(result).toBe(products);
    expect(adapter.loadMany).toHaveBeenCalledWith([
      { code: '333', scope: 'test' },
    ]);
  });
});
