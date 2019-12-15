import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StylesPage } from './styles.page';

describe('StylesPage', () => {
  let component: StylesPage;
  let fixture: ComponentFixture<StylesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StylesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StylesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
